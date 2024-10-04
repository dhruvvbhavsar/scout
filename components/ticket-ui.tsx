"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QrCode } from "lucide-react";

interface tickeProps {
  title: string;
  seats: string[];
  totalPrice: number;
}

export default function Ticket(props: tickeProps) {
  return (
    <div className="w-full mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white dark:bg-background overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6">
            <CardTitle className="text-2xl font-bold text-center">
              {props.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{new Date().toDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cinema</p>
                <p className="font-semibold">World Cinemas</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Screen</p>
                <p className="font-semibold">Screen X</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Seats</p>
              <div className="flex flex-wrap gap-2">
                {props.seats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm font-semibold"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold">${props.totalPrice}</p>
              </div>
              <div className="qr-code">
                <QrCode size={64} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted p-4 text-center text-sm text-muted-foreground">
            Please present this ticket at the entrance. Enjoy your movie!
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
