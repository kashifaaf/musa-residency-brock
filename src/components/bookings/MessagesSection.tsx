"use client";

import { useState, useEffect } from "react";
import { sendMessage, getMessages } from "@/actions/messages";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { MessageWithUsers } from "@/types";

interface MessagesSectionProps {
  bookingId: string;
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
}

export function MessagesSection({
  bookingId,
  currentUserId,
  otherUserId,
  otherUserName,
}: MessagesSectionProps) {
  const [messages, setMessages] = useState<MessageWithUsers[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [bookingId]);

  async function loadMessages() {
    setLoading(true);
    const result = await getMessages(bookingId);
    
    if (result.success) {
      setMessages(result.data);
    }
    
    setLoading(false);
  }

  async function handleSend() {
    if (!newMessage.trim()) return;

    setSending(true);
    
    const formData = new FormData();
    formData.append("bookingRequestId", bookingId);
    formData.append("recipientId", otherUserId);
    formData.append("content", newMessage);

    const result = await sendMessage(formData);
    
    if (result.success) {
      setNewMessage("");
      await loadMessages();
    } else {
      alert(result.error);
    }
    
    setSending(false);
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b p-4">
        <h3 className="font-semibold">Messages with {otherUserName}</h3>
      </div>

      <div className="h-[400px] overflow-y-auto p-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted-foreground">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.senderId === currentUserId ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    message.senderId === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {formatDate(message.createdAt, { hour: "numeric", minute: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          rows={2}
          className="mb-2"
        />
        <Button
          onClick={handleSend}
          disabled={sending || !newMessage.trim()}
          className="w-full"
        >
          {sending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
}