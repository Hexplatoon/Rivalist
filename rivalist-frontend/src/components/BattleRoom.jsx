import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBattle, useStomp } from "@/utils/StompContext";
import { useAuth } from "@/utils/AuthContext";
import { Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BattleWaitingPage() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isReady, setIsReady] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);;
  const { send, subscribeWithCleanup } = useStomp();
  const {token} = useAuth()
  const [opponentResponded, setOpponentResponded] = useState(false);
  const [expired, setExpired] = useState(false);
  const {battleData} = useBattle();
  const navigate = useNavigate();

  // Timer countdown (frontend-only, no timeout API calls)
  useEffect(() => {
    let id = localStorage.getItem("battleId");
    if (!battleData?.battleId) console.log("No Battle Data");
    if (!battleData?.battleId || battleData.battleId == id){
      navigate("/");
    }else{
      localStorage.setItem == id;
    }
    if (timeLeft > 0 && !battleStarted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, battleStarted]);

  // Subscribe to battle start command
  useEffect(() => {
    if (!token) return;

    const cleanup = subscribeWithCleanup("/user/topic/battle/start", (message) => {
      const data = JSON.parse(message.body);
      console.log("data",data);
      
      setBattleStarted(true);
    });

    return cleanup;
  }, [token]);

  const handleReady = () => {
    if (!isReady && battleData?.battleId) {
      // Convert to numeric value first
      const battleId = Number(battleData.battleId);
      
      
      send(
        "/app/battle/ready", battleId // 👈 Must be a number, not object
      );
      
      setIsReady(true);
    }
  };

  if (battleStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl font-bold">Battle Started!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-green-500 py-8">
              The battle has begun! 🚀
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl font-bold">Battle Waiting Room</CardTitle>
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
                {isReady && <span className="text-green-500">✔ Ready</span>}
              </div>
            </div>

            <div className="text-4xl font-bold text-primary">VS</div>

            {/* Opponent - No status tracking */}
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-32 h-32 border-2 border-destructive">
                <AvatarImage src="/api/placeholder/400/400" alt="Opponent avatar" />
                <AvatarFallback className="text-xl">OPP</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-xl">Opponent</h3>
              </div>
            </div>
          </div>

          {timeLeft <= 0 && (
            <div className="mt-10 p-4 bg-destructive/10 rounded-md text-center">
              <p className="text-destructive font-medium">Time expired!</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pt-4 pb-6">
          <div className="relative w-2/3">
            {!isReady && timeLeft > 0 && (
              <div className="absolute inset-0 rounded-md overflow-hidden">
                <div 
                  className="h-full bg-primary/20"
                  style={{ 
                    width: `${(timeLeft / 30) * 100}%`,
                    transition: 'width 1s linear'
                  }}
                />
              </div>
            )}
            
            <Button 
              className="w-full h-12 text-lg font-medium relative z-10"
              variant={isReady ? "secondary" : "default"}
              onClick={handleReady}
              disabled={isReady || timeLeft <= 0}
            >
              {isReady ? 'READY!' : 'I\'M READY'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}