
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';

interface MatchmakingScreenProps {
  battleType: string;
}

const MatchmakingScreen: React.FC<MatchmakingScreenProps> = ({ battleType }) => {
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const mode = location.state?.mode || 'random';
  const settings = location.state?.settings;
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getColorForBattleType = () => {
    switch(battleType) {
      case 'typing': return '#4361EE';
      case 'css': return '#9B5DE5';
      case 'codeforces': return '#F72585';
      default: return '#4361EE';
    }
  };
  
  const getBattleTypeDisplay = () => {
    switch(battleType) {
      case 'typing': return 'Typing';
      case 'css': return 'CSS Design';
      case 'codeforces': return 'Codeforces';
      default: return battleType;
    }
  };

  useEffect(() => {
    // Simulate matchmaking progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 300);
    
    // Track elapsed time
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    
    // Simulate finding a match
    const matchTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      
      // Navigate to battle
      navigate(`/battle/${battleType}/room`, {
        state: { 
          opponent: {
            username: 'RandomPlayer123',
            rating: battleType === 'codeforces' ? 1500 : 1200
          },
          settings
        }
      });
    }, 5000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      clearTimeout(matchTimeout);
    };
  }, [battleType, navigate, settings]);
  
  const handleCancel = () => {
    setIsCancelling(true);
    
    setTimeout(() => {
      toast({
        title: "Matchmaking cancelled",
        description: "You have left the matchmaking queue.",
      });
      navigate('/');
    }, 500);
  };
  
  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-2">Finding Opponent</h2>
      <p className="text-muted-foreground mb-8 text-center">
        Searching for a {getBattleTypeDisplay()} battle opponent...
      </p>
      
      <div className="w-48 h-48 mb-8">
        <CircularProgressbar
          value={progress}
          text={formatTime(timeElapsed)}
          styles={buildStyles({
            pathColor: getColorForBattleType(),
            textColor: getColorForBattleType(),
            trailColor: 'rgba(255, 255, 255, 0.1)',
          })}
        />
      </div>
      
      {battleType === 'codeforces' && settings && (
        <div className="bg-muted/30 p-4 rounded-md mb-6 w-full max-w-sm">
          <h3 className="text-sm font-medium mb-2">Your Search Criteria:</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Tags: {settings.tags.join(', ') || 'Any'}</p>
            <p>Rating: {settings.minRating} - {settings.maxRating}</p>
            <p>Questions: {settings.numQuestions}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center animate-pulse mb-4">
        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Searching...</span>
      </div>
      
      <Button 
        variant="outline" 
        onClick={handleCancel} 
        disabled={isCancelling}
      >
        {isCancelling ? 'Cancelling...' : 'Cancel Search'}
      </Button>
    </div>
  );
};

export default MatchmakingScreen;
