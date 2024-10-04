"use client";
import { ClientMessage } from "@/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { useActions, useUIState } from "ai/rsc";
import {
  Mountain,
  Award,
  Camera,
  Ticket,
  Popcorn,
  BaggageClaim,
  Timer,
  Binoculars,
} from "lucide-react";

export default function EmptyState() {
  const { continueConversation } = useActions();
  const [_, setMessages] = useUIState();

  const handleCardClick = async (message: string) => {
    const response = await continueConversation(message);
    setMessages((currentMessages: ClientMessage[]) => [
      ...currentMessages,
      response,
    ]);
  };

  const cardData = [
    {
      icon: <BaggageClaim className="w-6 h-6 mr-4 text-blue-400" />,
      text: "Suggest movies, I am feeling adventurous",
    },
    {
      icon: <Popcorn className="w-6 h-6 mr-4 text-yellow-400" />,
      text: "Tell me something about the latest bond movie",
    },
    {
      icon: <Ticket className="w-6 h-6 mr-4 text-yellow-400" />,
      text: "Book tickets for the Dune movie",
    },
    {
      icon: <Camera className="w-6 h-6 mr-4 text-purple-400" />,
      text: "List all the movies directed by Christopher Nolan",
    },
    {
      icon: <Award className="w-6 h-6 mr-4 text-red-400" />,
      text: "List oscar winning movies from 2004 to 2010",
    },
    {
      icon: <Timer className="w-6 h-6 mr-4 text-green-400" />,
      text: "Tell me something about the movie Inception",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Binoculars className="size-16" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-8">
        {cardData.map((card, index) => (
          <Card
            key={index}
            onClick={() => handleCardClick(card.text)}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="flex items-center p-4">
              {card.icon}
              <p className="text-sm">{card.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
