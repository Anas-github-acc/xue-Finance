"use client"

import "ios-vibrator-pro-max"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import type { UseChatHelpers } from '@ai-sdk/react'
import {
  Search,
  Plus,
  Lightbulb,
  ArrowUp,
  // Menu,
  // PenSquare,
  RefreshCcw,
  Copy,
  Share2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Background style CSS
const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    bttom:0;
    right: 0;
    width: 100%;
    height: 100vh;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

type ActiveButton = "none" | "add" | "deepSearch" | "think"

interface ChatInterfaceProps {
  chatProps: UseChatHelpers
}

export default function ChatInterface({ chatProps }: ChatInterfaceProps) {
  const { messages: aiMessages, handleInputChange: aiHandleInputChange, handleSubmit: aiHandleSubmit, isLoading } = chatProps

  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [hasTyped, setHasTyped] = useState(false)
  const [activeButton, setActiveButton] = useState<ActiveButton>("none")
  const [isMobile, setIsMobile] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const selectionStateRef = useRef<{ start: number | null; end: number | null }>({ start: null, end: null })

  // Constants for layout calculations
  // const TOP_PADDING = 48 // pt-12 (3rem = 48px)
  // const BOTTOM_PADDING = 128 // pb-32 (8rem = 128px)
  // const ADDITIONAL_OFFSET = 16 // Reduced offset for fine-tuning
  
  const focusTextarea = useCallback(() => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus()
    }
  }, [isMobile])

  // Check if device is mobile and get viewport height
  useEffect(() => {
    const checkMobileAndViewport = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)
      const vh = window.innerHeight
      setViewportHeight(vh)
      if (isMobileDevice && mainContainerRef.current) {
        mainContainerRef.current.style.height = `${vh}px`
      }
    }

    checkMobileAndViewport()

    if (mainContainerRef.current) {
      mainContainerRef.current.style.height = isMobile ? `${viewportHeight}px` : "100svh"
    }

    window.addEventListener("resize", checkMobileAndViewport)
    return () => {
      window.removeEventListener("resize", checkMobileAndViewport)
    }
  }, [isMobile, viewportHeight])

  // Save the current selection state
  const saveSelectionState = () => {
    if (textareaRef.current) {
      selectionStateRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      }
    }
  }

  // Restore the saved selection state
  const restoreSelectionState = () => {
    const textarea = textareaRef.current
    const { start, end } = selectionStateRef.current

    if (textarea && start !== null && end !== null) {
      textarea.focus()
      textarea.setSelectionRange(start, end)
    } else if (textarea) {
      textarea.focus()
    }
  }

  const handleInputContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target === e.currentTarget ||
      (e.currentTarget === inputContainerRef.current && !(e.target as HTMLElement).closest("button"))
    ) {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value

    if (!isLoading) {
      setInputValue(newValue)
      aiHandleInputChange(e)

      if (newValue.trim() !== "" && !hasTyped) {
        setHasTyped(true)
      } else if (newValue.trim() === "" && hasTyped) {
        setHasTyped(false)
      }

      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        const newHeight = Math.max(24, Math.min(textarea.scrollHeight, 160))
        textarea.style.height = `${newHeight}px`
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      // Add vibration when message is submitted
      navigator.vibrate(50)

      // Submit to AI SDK
      aiHandleSubmit(e)
      
      // Reset input
      setInputValue("")
      setHasTyped(false)
      setActiveButton("none")

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }

      // Only focus the textarea on desktop, not on mobile
      if (!isMobile) {
        focusTextarea()
      } else {
        // On mobile, blur the textarea to dismiss the keyboard
        if (textareaRef.current) {
          textareaRef.current.blur()
        }
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Cmd+Enter on both mobile and desktop
    if (!isLoading && e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      handleSubmit(e)
      return
    }

    // Only handle regular Enter key (without Shift) on desktop
    if (!isLoading && !isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleButton = (button: ActiveButton) => {
    if (!isLoading) {
      saveSelectionState()
      setActiveButton((prev) => (prev === button ? "none" : button))
      setTimeout(() => {
        restoreSelectionState()
      }, 0)
    }
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (aiMessages.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [aiMessages])

  // Focus the textarea on component mount (only on desktop)
  useEffect(() => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus()
    }
  }, [isMobile])

  return (
    <>
      <style jsx global>{backgroundStyle}</style>
      <div
        ref={mainContainerRef}
        className="bg-[#0f172a] flex flex-col overflow-hidden"
        style={{ height: isMobile ? `${viewportHeight}px` : "100svh", background: "radial-gradient(circle at center, #0f172a, #000000)"}}
      >
        <div className="bg-pattern"></div>
        <div className="content">

          <div ref={chatContainerRef} className="grow pb-32 pt-12 px-4 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-6">
              {aiMessages.map(message => (
                <div key={message.id} className={cn(
                  "flex flex-col", 
                  message.role === "user" ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "max-w-[85%] px-4 py-3 rounded-2xl shadow-md",
                    message.role === "user" 
                      ? "bg-[#1e293b] border border-[#334155] rounded-br-none text-white" 
                      : "bg-[#334155] text-white rounded-bl-none"
                  )}>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <div 
                              key={`${message.id}-${i}`} 
                              className="whitespace-pre-wrap text-[15px] leading-relaxed"
                            >
                              {part.text}
                            </div>
                          );
                        case 'tool-invocation':
                          return (
                            <pre 
                              key={`${message.id}-${i}`} 
                              className="bg-[#0f172a] text-[#e2e8f0] p-3 rounded-md text-sm overflow-x-auto my-2 font-mono border border-[#475569]"
                            >
                              {JSON.stringify(part.toolInvocation, null, 2)}
                            </pre>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                  
                  {/* Message actions for AI responses */}
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 px-2 mt-2 mb-1">
                      <button className="text-[#94a3b8] hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <RefreshCcw className="h-4 w-4" />
                      </button>
                      <button className="text-[#94a3b8] hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="text-[#94a3b8] hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="text-[#94a3b8] hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button className="text-[#94a3b8] hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent bg-opacity-80 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div
                ref={inputContainerRef}
                className={cn(
                  "relative w-full rounded-3xl border border-[#334155] bg-[#1e293b] p-3 cursor-text shadow-lg",
                  isLoading && "opacity-80",
                )}
                onClick={handleInputContainerClick}
              >
                <div className="pb-15">
                  <Textarea
                    ref={textareaRef}
                    placeholder={isLoading ? "Waiting for response..." : "Ask Anything"}
                    className="min-h-[24px] max-h-[160px] w-full rounded-3xl border-0 bg-transparent text-white placeholder:text-[#94a3b8] placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-3 pt-1 pb-0 resize-none overflow-y-auto leading-tight"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (textareaRef.current) {
                        textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
                      }
                    }}
                    disabled={isLoading}
                  />
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={cn(
                          "rounded-full h-8 w-8 shrink-0 border-[#475569] p-0 transition-colors bg-transparent hover:bg-white/10",
                          activeButton === "add" && "bg-white/10 border-[#64748b]",
                        )}
                        onClick={() => toggleButton("add")}
                        disabled={isLoading}
                      >
                        <Plus className={cn("h-4 w-4 text-[#94a3b8]", activeButton === "add" && "text-white")} />
                        <span className="sr-only">Add</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={cn(
                          "rounded-full h-8 w-8 shrink-0 border-[#475569] p-0 transition-colors bg-transparent hover:bg-white/10",
                          activeButton === "deepSearch" && "bg-white/10 border-[#64748b]",
                        )}
                        onClick={() => toggleButton("deepSearch")}
                        disabled={isLoading}
                      >
                        <Search className={cn("h-4 w-4 text-[#94a3b8]", activeButton === "deepSearch" && "text-white")} />
                        <span className="sr-only">Deep Search</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "rounded-full h-8 px-3 flex items-center border-[#475569] gap-1.5 transition-colors bg-transparent hover:bg-white/10",
                          activeButton === "think" && "bg-white/10 border-[#64748b]",
                        )}
                        onClick={() => toggleButton("think")}
                        disabled={isLoading}
                      >
                        <Lightbulb className={cn("h-4 w-4 text-[#94a3b8]", activeButton === "think" && "text-white")} />
                        <span className={cn("text-white text-sm", activeButton === "think" && "font-medium")}>
                          Think
                        </span>
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "rounded-full h-8 w-8 border-0 shrink-0 transition-all duration-200",
                        hasTyped ? "bg-[#38bdf8] scale-110" : "bg-[#475569]",
                        isLoading && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <ArrowUp className={cn("h-4 w-4 transition-colors", hasTyped ? "text-[#0f172a]" : "text-[#94a3b8]")} />
                      <span className="sr-only">Submit</span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

