import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import yahooFinance from 'yahoo-finance2';
import { safetyCheck } from '@/utils/safety';
import { Memory } from '@/utils/memory';

export const maxDuration = 30;

// Initialize Google Gemini client
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY ?? '',
});

if (!google) {
  throw new Error('Google Gemini client initialization failed. Please check your API key.');
}

const memory = new Memory();

export async function POST(req: Request) {
  let prompt: string;
  try {
    const { messages } = await req.json();
    console.log(messages);
    prompt = messages[messages.length - 1].content;
  } catch (error) {
    return new Response(JSON.stringify({ error: `Error: ${error}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate prompt
  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'Prompt is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Safety check
  if (!safetyCheck(prompt)) {
    return new Response(JSON.stringify({ error: 'Your request contains prohibited content' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Construct prompt with memory
    const thread = `Previous conversation:\n${memory.recall()}\n\nCurrent question: ${prompt}`;
    console.log('Thread:', thread);

    // Stream response using Vercel AI SDK and Gemini
    const result = streamText({
      model: google('models/gemini-1.5-flash'),
      prompt: thread,
      tools: {
        getStockPrice: tool({
          description: 'Fetch the latest stock price for a given symbol using Yahoo Finance',
          parameters: z.object({
            symbol: z.string().describe('Stock symbol, e.g., AAPL'),
          }),
          execute: async ({ symbol }: { symbol: string }) => {
            try {
              const quote = await yahooFinance.quote(symbol);
              const price = quote.regularMarketPrice || quote.bid || quote.ask;
              const currency = quote.currency;
              const response = `The current stock price of ${symbol} is ${price ? price.toFixed(2).toString() + ` ${currency}` : 'not available'}.`;
              memory.remember({ role: 'assistant', content: response });
              return response;
            } catch (error) {
              const errorResponse = `Unable to fetch stock price for ${symbol}. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the symbol and try again.`;
              memory.remember({ role: 'assistant', content: errorResponse });
              return errorResponse;
            }
          },
        }),
      },
    });

    // Store user prompt in memory
    memory.remember({ role: 'user', content: prompt });

    return result.toDataStreamResponse(
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )

} catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}