import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Timer, CheckCircle } from "lucide-react";
import { useBattle } from "@/utils/StompContext";

export default function BattleWaitingPage() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isReady, setIsReady] = useState(false);
  const [opponentResponded, setOpponentResponded] = useState(false);
  const [expired, setExpired] = useState(false);
  const {battleData} = useBattle(); 

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setExpired(true);
    }
  }, [timeLeft]);

  const handleReady = () => {
    setIsReady(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl font-bold">
            Battle Waiting Room
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Timer size={18} />
            <span>{timeLeft} seconds remaining</span>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex justify-center items-center gap-16">
            {/* Player */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-32 h-32 border-2 border-primary">
                <AvatarImage src="/api/placeholder/400/400" alt="Your avatar" />
                <AvatarFallback className="text-xl">YOU</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-xl">You</h3>
                {/* Removed the ready text for the player */}
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl font-bold text-primary">VS</div>
              <div className="h-20 w-px bg-border"></div>
            </div>

            {/* Opponent */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-32 h-32 border-2 border-destructive">
                <AvatarImage
                  src="/api/placeholder/400/400"
                  alt="Opponent avatar"
                />
                <AvatarFallback className="text-xl">OPP</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-xl">Opponent</h3>
                {opponentResponded && (
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <CheckCircle size={14} /> Ready
                  </div>
                )}
              </div>
            </div>
          </div>

          {expired && !opponentResponded && (
            <div className="mt-10 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-center">
              <p className="text-destructive font-medium text-lg">
                Opponent didn't respond
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pt-4 pb-6">
          <div className="relative w-2/3">
            {/* Progress bar background that fills entire button */}
            {!isReady && !expired && (
              <div className="absolute inset-0 rounded-md overflow-hidden">
                <div
                  className="h-full bg-primary/20"
                  style={{
                    width: `${(timeLeft / 30) * 100}%`,
                    transition: "width 1s linear",
                  }}
                />
              </div>
            )}

            {/* Button with green background when ready */}
            <Button
              className={`w-full h-12 text-lg font-medium relative z-10 ${
                isReady
                  ? "bg-green-400 hover:bg-green-700"
                  : "bg-muted/80 hover:bg-muted"
              }`}
              variant={isReady ? "default" : "secondary"}
              onClick={handleReady}
              disabled={isReady || expired}
            >
              {isReady ? "READY!" : "I'M READY"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
