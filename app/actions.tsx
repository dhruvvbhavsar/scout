"use server";

import { getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { generateId } from "ai";
import { sleep } from "@/lib/utils";
import MovieInfo from "@/components/movie-info";
import MovieList from "@/components/movie-list";
import TicketBooking from "@/components/seat-booking";
import Ticket from "@/components/ticket-ui";
import Spinner from "@/components/spinner";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-4o-mini-2024-07-18"),
    messages: [...history.get(), { role: "user", content: input }],
    initial: <Spinner />,
    system: systemP,
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div>{content}</div>;
    },
    tools: {
      showMovieInformation: {
        description: "Get information about a movie",
        parameters: z.object({
          title: z
            .string()
            .describe("The title of the movie to get information for"),
          message: z
            .string()
            .describe("A message to display along with the movie"),
        }),
        generate: async function* ({ title, message }) {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing movie information for ${title}`,
            },
          ]);

          await sleep(1000);

          const movieData = await fetch(
            `https://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`
          ).then((res) => res.json());

          if (movieData.Response === "False") {
            yield <div>Movie not found</div>;
            return;
          }

          return <MovieInfo message={message} movie={movieData} />;
        },
      },
      showMovieSuggestions: {
        description: "Get a list of movie suggestions",
        parameters: z.object({
          titles: z.array(z.string()).describe("The titles of the movies"),
          message: z
            .string()
            .describe(
              "a fun little message to display along with the movie suggestions. follow the tone of the user's input"
            ),
        }),
        generate: async function* ({ titles, message }) {
          yield <Spinner />;

          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing movie suggestions for ${titles.join(", ")}`,
            },
          ]);

          await sleep(1000);

          const movieSuggestions = await Promise.all(
            titles.map((title) =>
              fetch(
                `https://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`
              ).then((res) => res.json())
            )
          );

          return (
            <MovieList message={message} movieSuggestions={movieSuggestions} />
          );
        },
      },
      bookTicket: {
        description: "Book a ticket for a movie",
        parameters: z.object({
          title: z
            .string()
            .describe("The title of the movie to book a ticket for"),
        }),
        generate: async function* ({ title }) {
          yield <Spinner />;

          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Booking ticket for ${title}`,
            },
          ]);

          await sleep(1000);

          return <TicketBooking title={title} />;
        },
      },
      showTicket: {
        description: "Show the ticket",
        parameters: z.object({
          title: z.string().describe("The title of the movie"),
          seats: z.array(z.string()).describe("The seats booked"),
          totalPrice: z.number().describe("The total price of the ticket"),
        }),
        generate: async function* ({ title, seats, totalPrice }) {
          yield <Spinner />;

          history.done((messages: ServerMessage[]) => [
            ...messages,
            {
              role: "assistant",
              content: `Showing ticket for ${title}`,
            },
          ]);

          await sleep(1000);

          return <Ticket title={title} seats={seats} totalPrice={totalPrice} />;
        },
      },
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}



const systemP = `
You are an AI assistant called scout specialized in movies and cinema, designed to provide efficient and intelligent responses. Your primary function is to help users with movie-related queries, suggestions, and ticket bookings. Use the available tools to enhance the user experience. Here are your key responsibilities and guidelines:

1. Movie Information:
   - Use the showMovieInformation tool when users ask about a specific movie.
   - Provide concise, informative responses about movie details.

2. Movie Suggestions:
   - Utilize the showMovieSuggestions tool for movie recommendations.
   - Offer tailored suggestions based on any preferences the user has expressed.

3. Ticket Booking:
   - Use the bookTicket tool when users show interest in watching a movie or booking tickets.
   - Guide users through the booking process efficiently.

4. Ticket Display:
   - After booking, use the showTicket tool to display ticket information.

5. Conversation Approach:
   - Maintain a friendly yet efficient tone.
   - Make intelligent decisions based on context without asking unnecessary follow-up questions.
   - If a request is ambiguous, make a reasonable assumption and proceed, only asking for clarification if absolutely necessary.

6. Additional Guidelines:
   - For current movies or showtimes, remind users to check with local theaters for the most up-to-date information.
   - Provide general information about movie ratings or reviews when relevant.
   - Politely redirect off-topic queries back to movies and cinema.

Use the appropriate tool for each user request:
- showMovieInformation for specific movie queries
- showMovieSuggestions for movie recommendations
- bookTicket for ticket booking
- showTicket for displaying booked ticket information

Your goal is to provide a seamless, informative, and enjoyable experience while making smart decisions and minimizing unnecessary interactions.
`;