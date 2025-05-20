"use client"

import { useChat } from '@ai-sdk/react'
import ChatInterface from "@/components/chat-interface"

export default function Page() {
  const chatProps = useChat({
    api: '/api/chat',
  })

  return (
    <>
      <ChatInterface chatProps={chatProps} />
    </>
  )
}

