"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';
import { toast } from 'sonner';
import { sendMessage } from '@/actions/message';
import type { MessageWithUsers, User } from '@/types';

interface MessageThreadProps {
  bookingId: string;
  messages: MessageWithUsers[];
  currentUserId: string;
  otherUser: User;
}

export function MessageThread({ 
  bookingId, 
  messages, 
  currentUserId, 
  otherUser 
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendMessage({
        bookingId,
        recipientId: otherUser.id,
        content: newMessage.trim(),
      });

      if (result.success) {
        setNewMessage('');
        toast.success('Message sent');
      } else {
        toast.error(result.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={otherUser.profileImage || ''} />
            <AvatarFallback>
              {otherUser.name?.charAt(0) || otherUser.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {otherUser.name || 'User'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">No messages yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === currentUserId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === currentUserId
                      ? 'text-primary-foreground/70'
                      : 'text-gray-500'
                  }`}>
                    {formatRelativeDate(message.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Send Message Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[60px] max-h-[120px]"
            rows={2}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !newMessage.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}