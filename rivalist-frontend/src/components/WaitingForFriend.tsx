
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Clock } from 'lucide-react';

const WaitingForFriend = ({ battleType }: { battleType: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const friendId = location.state?.friendId;
  const friendName = location.state?.friendName || 'your friend';
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    // Track elapsed time
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    
    // Simulate friend accepting the challenge
    const acceptTimeout = setTimeout(() => {
      // 50% chance the friend accepts
      const accepted = Math.random() > 0.5;
      
      if (accepted) {
        toast({
          title: "Challenge accepted!",
          description: `${friendName} has accepted your challenge.`,
        });
        
        // Navigate to battle
        navigate(`/battle/${battleType}/room`, {
          state: { 
            opponent: {
              username: friendName,
              id: friendId
            },
            mode: 'friend'
          }
        });
      } else {
        toast({
          title: "Challenge declined",
          description: `${friendName} has declined your challenge.`,
        });
        navigate('/');
      }
    }, 8000);
    
    return () => {
      clearInterval(timeInterval);
      clearTimeout(acceptTimeout);
    };
  }, [battleType, friendId, friendName, navigate, toast]);
  
  const handleCancel = () => {
    toast({
      title: "Challenge cancelled",
      description: `You have cancelled your challenge to ${friendName}.`,
    });
    navigate('/');
  };
  
  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-2">Challenge Sent!</h2>
      <p className="text-muted-foreground mb-8 text-center">
        Waiting for {friendName} to accept your challenge...
      </p>
      
      <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center mb-8">
        <Clock className="h-12 w-12 text-muted-foreground animate-pulse" />
      </div>
      
      <div className="bg-muted/30 p-4 rounded-md mb-6 text-center">
        <p className="text-lg font-medium">{formatTime(timeElapsed)}</p>
        <p className="text-xs text-muted-foreground">Time elapsed</p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={handleCancel}
      >
        Cancel Challenge
      </Button>
    </div>
  );
};

export default WaitingForFriend;
