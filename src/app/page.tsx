'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  const [loading, setLoading] = useState(false);

   const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    handleSubmit(e);
    setLoading(false);
  };


  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black/70 rounded-lg shadow-lg p-6">
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
          {messages.map(message => (
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === 'user' ? 'User: ' : 'AI: '}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  case 'tool-invocation':
                    return (
                      <pre key={`${message.id}-${i}`}>
                        {JSON.stringify(part.toolInvocation, null, 2)}
                      </pre>
                    );
                }
              })}
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <input
              className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </form>
          {loading && (
            <div className="text-gray-500">
              <p>Loading...</p>
            </div>
          )}
          <div className="text-gray-500">
            <p>Powered by Gemini</p>
            <p>Built with Next.js and Vercel AI SDK</p>
          </div>
          </div>
        </div>
    </div>
  );
}
