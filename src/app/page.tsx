"use client"

import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import Link from "next/link"

export default function Page() {

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <TextHoverEffect text="XUE" duration={0.1} />

      <div className='absolute gap-10 top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl font-bold text-white'>
        <p className="font-bold text-transparent text-[2em] bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4 
          drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] 
          text-shadow-[0_0_15px_rgba(255,255,255,0.2)] 
          animate-pulse">
            AI AGENTS ARE THE FUTURE
        </p>

        <Link href="/chat" className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block transition-all duration-300">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 text-[1.4em] items-center z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10 ">
            <span>
              chat with XUE
            </span>
            <span className="scale-[1.4]">
              <svg
                fill="none"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.75 8.75L14.25 12L10.75 15.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </Link>
      </div>
    </div>
  )
}

