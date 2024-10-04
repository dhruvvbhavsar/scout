"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scroll, Star } from "lucide-react";
import Image from "next/image";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage } from "@/app/actions";
import { MovieProps } from "@/lib/types";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function MovieList({
  movieSuggestions,
  message,
}: {
  movieSuggestions: MovieProps[];
  message: string;
}) {
  const { continueConversation } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <div className="w-full mx-auto py-8">
      <p className="mb-2">{message}</p>
      <ScrollArea className="pb-4">
        <div className="flex space-x-4 p-4">
          {movieSuggestions.map((movie, index) => (
            <div key={index} className="flex-none w-[280px]">
              <Card
                onClick={async () => {
                  const response = await continueConversation(
                    `Tell me more about ${movie.Title}`
                  );
                  setMessages((currentMessages: ClientMessage[]) => [
                    ...currentMessages,
                    response,
                  ]);
                }}
                className="h-full cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200"
              >
                <CardContent className="p-4">
                  <div className="relative w-full h-[360px] mb-4">
                    <Image
                      src={movie.Poster}
                      alt={`${movie.Title} Poster`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2 truncate">
                    {movie.Title}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{movie.Year}</Badge>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-semibold">{movie.imdbRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {movie.Genre}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
