"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage } from "@/app/actions";

interface SeatProps {
  id: number;
  isSelected: boolean;
  isOccupied: boolean;
  onSelect: (id: number) => void;
}

const Seat: React.FC<SeatProps> = React.memo(
  ({ id, isSelected, isOccupied, onSelect }) => {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-8 h-8 m-1 rounded-t-lg transition-colors duration-200 ${
          isOccupied
            ? "bg-gray-400 cursor-not-allowed"
            : isSelected
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={() => !isOccupied && onSelect(id)}
        disabled={isOccupied}
        aria-label={`Seat ${id} ${
          isOccupied ? "Occupied" : isSelected ? "Selected" : "Available"
        }`}
      />
    );
  }
);

Seat.displayName = "Seat";

export default function TicketBooking({ title }: { title: string }) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const occupiedSeats = useMemo(() => [3, 14, 15, 26, 37, 48], []);

  const { continueConversation } = useActions();
  const [_, setMessages] = useUIState();

  const rows = 6;
  const seatsPerRow = 8;
  const price = 12;

  const toggleSeat = (id: number) => {
    setSelectedSeats((prev: number[]) =>
      prev.includes(id) ? prev.filter((seat) => seat !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedSeats.length * price;

  return (
    <div className="w-full mx-auto py-8">
      <Card className="bg-gray-100 dark:bg-background">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="w-full h-16 bg-gradient-to-b from-gray-900 to-black rounded-t-full flex items-center justify-center">
              <div className="w-3/4 h-2 bg-white dark:bg-gray-400 rounded-full"></div>
            </div>
            <p className="text-center text-sm mt-2 text-gray-600 dark:text-gray-400">
              Screen
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 mb-8">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center">
                {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                  const seatId = rowIndex * seatsPerRow + seatIndex + 1;
                  return (
                    <Seat
                      key={seatId}
                      id={seatId}
                      isSelected={selectedSeats.includes(seatId)}
                      isOccupied={occupiedSeats.includes(seatId)}
                      onSelect={toggleSeat}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-6 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 mr-2 rounded"></div>
              <span className="text-sm">Occupied</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <div className="text-center mb-4">
            <p className="text-lg font-semibold">
              Selected Seats: {selectedSeats.length}
            </p>
            <p className="text-2xl font-bold">Total: ${totalPrice}</p>
          </div>
          <Button
            className="w-full max-w-xs hover:bg-green-500"
            disabled={selectedSeats.length === 0}
            onClick={async () => {
              const response = await continueConversation(
                `Booked x${selectedSeats.length} ${selectedSeats.join(
                  ", "
                )} seats for ${title} for $${totalPrice} , show ticket`
              );
              setMessages((currentMessages: ClientMessage[]) => [
                ...currentMessages,
                response,
              ]);
            }}
          >
            Book Seats
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
