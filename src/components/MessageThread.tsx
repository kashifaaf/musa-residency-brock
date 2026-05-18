"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Send } from "lucide-react"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"
import type { MessageWithSender } from "@/types"

export function MessageThread({
  bookingId,
  messages: initialMessages,
  currentUserId,
}: {
  bookingId: string
  messages: MessageWithSender[]
  currentUserId: string
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setSending(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setMessages((prev) => [...prev, data.data])
        setContent("")
      } else {
        toast.error(data.error || "Failed to send message")
      }
    } catch {
      toast.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="font-semibold text-gray-900">Messages</h3>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4" style={{ maxHeight: "400px" }}>
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId
            return (
              <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                {msg.sender.image ? (
                  <Image
                    src={msg.sender.image}
                    alt={msg.sender.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                    {msg.sender.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}>
                  <div
                    className={`inline-block rounded-2xl px-4 py-2 text-sm ${
                      isOwn
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {msg.sender.name?.split(" ")[0]} · {formatDate(msg.createdAt)}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 p-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="rounded-lg bg-primary-600 p-2.5 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}