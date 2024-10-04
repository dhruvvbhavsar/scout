"use client";

import { useState } from "react";
import { ClientMessage } from "./actions";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import EmptyState from "@/components/empty-state";
import { ArrowRight } from "lucide-react";

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="flex flex-col w-full min-h-dvh max-w-7xl border-x px-2 py-24 mx-auto stretch">
      {conversation.length > 0 ? (
        <div className="space-y-4 px-1">
          {conversation.map((m: ClientMessage) => (
            <div
              key={m.id}
              className={`whitespace-pre-wrap ${
                m.role === "user" ? "text-right" : ""
              }`}
            >
              <div>
                <div className="font-bold">
                  {m.role === "user" ? "You" : "AI"}
                </div>
                <>{m.display}</>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}


      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            { id: generateId(), role: "user", display: input },
          ]);

          const message = await continueConversation(input);

          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            message,
          ]);

          setInput("");
        }}
        className="fixed bottom-0 w-full max-w-md md:max-w-xl left-1/2 -translate-x-1/2 mb-8"
      >
        <div className="relative">
          <input
            className="w-full p-3 pr-12 border border-gray-300 shadow-xl rounded-full dark:bg-black text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 ease-in-out"
            value={input}
            placeholder="Say something..."
            onChange={(event) => setInput(event.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300 transition-colors duration-200"
          >
            <ArrowRight className="h-5 w-5" />
            <span className="sr-only">Submit</span>
          </button>
        </div>
      </form>
    </div>
  );
}
