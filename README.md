# XUE Finance

XUE Finance is an AI-powered financial assistant that helps you analyze stocks, manage investments, and make informed financial decisions.

## Features

- **Real-time Stock Analysis**: Get up-to-date stock prices and market data
- **AI-Powered Insights**: Leverage Gemini 1.5 Flash for intelligent financial analysis
- **Responsive Design**: Beautiful interface that works on desktop and mobile
- **Memory System**: Contextual conversations that remember your preferences

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **AI**: Google Gemini 1.5 Flash via AI SDK
- **Styling**: Tailwind CSS 4 with custom animations
- **Data**: Yahoo Finance API for real-time market data
- **UI Components**: Custom components with Shadcn/UI primitives

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/Anas-github-acc/xue-finance.git
cd xue-finance
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Create a `.env.local` file in the root directory with your API keys:

```
GOOGLE_API_KEY=your_gemini_api_key_here
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
xue-finance/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts  # Chat API endpoint
│   │   ├── chat/
│   │   │   └── page.tsx      # Chat interface page
│   │   ├── globals.css       # Global styles
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── ui/               # UI components
│   │   └── chat-interface.tsx # Main chat component
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   └── utils/
│       ├── memory.ts         # Conversation memory system
│       └── safety.ts         # Content safety checks
├── public/                   # Static assets
├── next.config.ts           # Next.js configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Deployment

The easiest way to deploy your XUE Finance app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Google Gemini](https://ai.google.dev/) - AI model powering the assistant
- [Yahoo Finance](https://finance.yahoo.com/) - Financial data provider
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
