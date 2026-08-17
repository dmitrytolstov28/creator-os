"use client";

import { FormEvent, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Ask me anything about your videos, performance, hooks, hashtags, or future content ideas.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();

    if (!question || loading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const { data: videos, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          videos: videos ?? [],
          messages: updatedMessages.slice(-8),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "AI chat failed.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not contact the AI coach.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Error: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6 text-white">
      <div>
        <h2 className="text-xl font-semibold">Chat With Your Data</h2>

        <p className="mt-1 text-sm text-zinc-400">
          Ask questions about your content performance.
        </p>
      </div>

      <div className="mt-6 max-h-[520px] space-y-4 overflow-y-auto pr-2">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex gap-3 ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === "user"
                  ? "bg-violet-600 text-white"
                  : "border border-zinc-800 bg-black/30 text-zinc-300"
              }`}
            >
              {message.content}
            </div>

            {message.role === "user" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                <User size={18} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Loader2 size={18} className="animate-spin" />
            CreatorOS is analyzing your data...
          </div>
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="mt-6 flex gap-3 border-t border-zinc-800 pt-6"
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Why did my latest video underperform?"
          className="border-zinc-700 bg-black text-white"
        />

        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-violet-600 text-white hover:bg-violet-500"
        >
          <Send size={17} />
          Send
        </Button>
      </form>
    </Card>
  );
}