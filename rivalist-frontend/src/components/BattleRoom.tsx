
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface BattleRoomProps {
  battleType: string;
}

const BattleRoom: React.FC<BattleRoomProps> = ({ battleType }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const opponent = location.state?.opponent || { username: 'Unknown Opponent' };
  const settings = location.state?.settings;
  
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [userProgress, setUserProgress] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [battleState, setBattleState] = useState<'countdown' | 'ongoing' | 'ended'>('countdown');
  const [countdown, setCountdown] = useState(3);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    // Countdown before battle starts
    if (battleState === 'countdown') {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setBattleState('ongoing');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
    
    // Main battle timer
    if (battleState === 'ongoing') {
      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            handleBattleEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Simulate opponent progress
      const opponentInterval = setInterval(() => {
        setOpponentProgress((prev) => {
          const newProgress = prev + Math.random() * 2;
          if (newProgress >= 100) {
            clearInterval(opponentInterval);
            // If opponent finishes first
            if (userProgress < 100) {
              setTimeout(() => handleBattleEnd(false), 1000);
            }
            return 100;
          }
          return newProgress;
        });
      }, 1000);
      
      return () => {
        clearInterval(timerInterval);
        clearInterval(opponentInterval);
      };
    }
  }, [battleState, userProgress]);
  
  const handleUserProgress = () => {
    // This would be replaced with actual progress tracking
    // For typing: keystrokes, for CSS: completion percentage, etc.
    if (battleState !== 'ongoing') return;
    
    setUserProgress((prev) => {
      const newProgress = prev + 5; // Increment by 5% for demo
      if (newProgress >= 100) {
        handleBattleEnd(true);
        return 100;
      }
      return newProgress;
    });
  };
  
  const handleBattleEnd = (userWon = userProgress > opponentProgress) => {
    setBattleState('ended');
    
    // Navigate to results screen
    navigate(`/battle/${battleType}/results`, {
      state: {
        opponent,
        userWon,
        userScore: Math.round(userProgress),
        opponentScore: Math.round(opponentProgress),
        timeSpent: 300 - timeLeft
      }
    });
  };
  
  const renderBattleContent = () => {
    switch (battleType) {
      case 'typing':
        return (
          <div className="bg-muted/20 p-6 rounded-lg w-full mt-6">
            <h3 className="text-center mb-4 font-medium">Type this paragraph:</h3>
            <p className="bg-muted/30 p-4 rounded text-muted-foreground mb-4 text-sm leading-relaxed">
              The quick brown fox jumps over the lazy dog. Programming requires patience and attention to detail.
              Algorithms help us solve complex problems efficiently. The best code is often the simplest solution.
            </p>
            <textarea 
              className="w-full bg-background border rounded-md p-3 min-h-[100px]"
              placeholder="Start typing here..."
              onChange={handleUserProgress}
            />
          </div>
        );
      
      case 'css':
        return (
          <div className="bg-muted/20 p-6 rounded-lg w-full mt-6">
            <h3 className="text-center mb-4 font-medium">Recreate this design:</h3>
            <div className="bg-muted/30 p-4 rounded mb-4">
              <div className="h-32 flex items-center justify-center">
                <div className="text-center">
                  <p>Target Design Preview</p>
                  <div className="flex items-center justify-center mt-2 gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary"></div>
                    <div className="w-16 h-8 rounded-md bg-secondary"></div>
                    <div className="w-8 h-16 rounded-md bg-tertiary"></div>
                  </div>
                </div>
              </div>
            </div>
            <textarea 
              className="w-full bg-background border rounded-md p-3 min-h-[100px] font-mono text-sm"
              placeholder="Write your CSS here..."
              onChange={handleUserProgress}
            />
          </div>
        );
      
      case 'codeforces':
        return (
          <div className="bg-muted/20 p-6 rounded-lg w-full mt-6">
            <h3 className="text-center mb-4 font-medium">Solve this problem:</h3>
            <div className="bg-muted/30 p-4 rounded mb-4 text-sm max-h-[200px] overflow-y-auto">
              <p className="font-medium mb-2">Problem: Two Sum</p>
              <p className="mb-2">
                Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
              </p>
              <p className="mb-2">
                You may assume that each input would have exactly one solution, and you may not use the same element twice.
              </p>
              <p>Example: nums = [2,7,11,15], target = 9 ⟹ Output: [0,1]</p>
            </div>
            <textarea 
              className="w-full bg-background border rounded-md p-3 min-h-[150px] font-mono text-sm"
              placeholder="Write your solution here..."
              onChange={handleUserProgress}
            />
          </div>
        );
        
      default:
        return <div>Unknown battle type</div>;
    }
  };
  
  if (battleState === 'countdown') {
    return (
      <div className="max-w-3xl mx-auto p-6 flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-4xl font-bold mb-12">Battle Starting in</h2>
        <div className="text-8xl font-bold mb-10 animate-pulse">{countdown}</div>
        <p className="text-muted-foreground text-xl">Get ready!</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Battle</h2>
          <p className="text-muted-foreground">vs {opponent.username}</p>
        </div>
        <div className="bg-muted/20 px-4 py-2 rounded-full">
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Your Progress</span>
            <span>{Math.round(userProgress)}%</span>
          </div>
          <Progress value={userProgress} className="h-3" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{opponent.username}'s Progress</span>
            <span>{Math.round(opponentProgress)}%</span>
          </div>
          <Progress value={opponentProgress} className="h-3" />
        </div>
      </div>
      
      {renderBattleContent()}
      
      <div className="mt-6 flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => handleBattleEnd(false)}
        >
          Forfeit Battle
        </Button>
      </div>
    </div>
  );
};

export default BattleRoom;
