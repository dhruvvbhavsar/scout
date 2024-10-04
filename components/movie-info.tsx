"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Star, Clock, Calendar, Award, User, Ticket } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MovieProps } from "@/lib/types";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage } from "@/app/actions";

export default function MovieInfo({ movie, message }: { movie: MovieProps, message: string }) {
  const genres = movie.Genre.split(", ");
  const actors = movie.Actors.split(", ");
  const runtimeInMinutes = parseInt(movie.Runtime);

  const { continueConversation } = useActions();
  const [_, setMessages] = useUIState();

  const ratingLogos = {
    "Internet Movie Database": "/imdb-logo.png",
    "Rotten Tomatoes": "/rotten-tomatoes-logo.png",
    Metacritic: "/metacritic-logo.png",
  };

  return (
    <div className="w-full mx-auto py-8">
      <p className="mb-2">{message}</p>
      <Card>
        <CardHeader className="relative pb-0 pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-80 h-[450px] md:h-[600px]">
              <Image
                src={movie.Poster}
                alt={`${movie.Title} Poster`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <CardTitle className="text-4xl md:text-5xl font-bold mb-2">
                  {movie.Title}
                </CardTitle>
                <p className="text-xl text-muted-foreground">{movie.Year}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{movie.Released}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{movie.Runtime}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="font-semibold">{movie.Rated}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-3xl font-bold">{movie.imdbRating}</span>
                  <span className="text-lg text-muted-foreground">
                    /10 ({movie.imdbVotes} votes)
                  </span>
                </div>
                <Progress
                  value={parseFloat(movie.imdbRating) * 10}
                  className="w-full h-2"
                />
              </div>
              <p className="text-sm flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary" />
                {movie.Awards}
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                {movie.Ratings.map((rating, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Image
                      src={
                        ratingLogos[
                          rating.Source as keyof typeof ratingLogos
                        ] || "/placeholder.svg?height=24&width=24"
                      }
                      alt={rating.Source}
                      width={64}
                      height={64}
                    />
                    <span className="font-semibold">{rating.Value}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={async () => {
                  const response = await continueConversation(
                    `Book tickets for ${movie.Title}`
                  );
                  setMessages((currentMessages: ClientMessage[]) => [
                    ...currentMessages,
                    response,
                  ]);
                }}
                className="w-full"
                size="lg"
              >
                <Ticket className="w-4 h-4 mr-2" />
                Book Tickets
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-semibold mb-3">Plot</h3>
                <p className="text-base leading-relaxed">{movie.Plot}</p>
              </section>
              <Separator />
              <section>
                <h3 className="text-2xl font-semibold mb-3">Cast & Crew</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {actors.map((actor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={actor}
                        />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{actor}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-base mb-1">Director</h4>
                    <p>{movie.Director}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">Writers</h4>
                    <p>{movie.Writer}</p>
                  </div>
                </div>
              </section>
              <Separator />
              <section>
                <h3 className="text-2xl font-semibold mb-3">Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-base mb-1">Language</h4>
                    <p>{movie.Language}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">Country</h4>
                    <p>{movie.Country}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">Box Office</h4>
                    <p>{movie.BoxOffice}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1">Runtime</h4>
                    <p>
                      {Math.floor(runtimeInMinutes / 60)}h{" "}
                      {runtimeInMinutes % 60}
                      min
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
