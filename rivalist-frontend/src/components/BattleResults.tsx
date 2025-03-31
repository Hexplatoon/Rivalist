
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Star, UserPlus, BarChart2, Home, RotateCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const BattleResults = ({ battleType }: { battleType: string }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addingFriend, setAddingFriend] = useState(false);
  
  const opponent = location.state?.opponent || { username: 'Unknown Opponent' };
  const userWon = location.state?.userWon || false;
  const userScore = location.state?.userScore || 0;
  const opponentScore = location.state?.opponentScore || 0;
  const timeSpent = location.state?.timeSpent || 0;
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get experience and rating changes
  const getExpGain = () => userWon ? Math.floor(Math.random() * 15) + 15 : Math.floor(Math.random() * 5) + 5;
  const getRatingChange = () => userWon ? Math.floor(Math.random() * 15) + 10 : -(Math.floor(Math.random() * 10) + 5);
  
  const handleAddFriend = () => {
    setAddingFriend(true);
    
    // Mock API call - would be replaced with actual implementation
    setTimeout(() => {
      toast({
        title: "Friend added!",
        description: `${opponent.username} has been added to your friends.`,
      });
      setAddingFriend(false);
    }, 1500);
  };
  
  const handleNewBattle = () => {
    navigate(`/battle/${battleType}`);
  };
  
  const handleViewDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  // Trigger confetti if user won
  useEffect(() => {
    if (userWon && typeof window !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [userWon]);
  
  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted/20 mb-6">
          {userWon ? (
            <Trophy className="h-12 w-12 text-yellow-500" />
          ) : (
            <Star className="h-12 w-12 text-blue-500" />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2">
          {userWon ? 'Victory!' : 'Good effort!'}
        </h2>
        <p className="text-muted-foreground">
          {userWon 
            ? 'Congratulations, you won the battle!' 
            : 'Keep practicing, you\'ll win next time!'}
        </p>
      </motion.div>
      
      <motion.div 
        className="bg-muted/20 rounded-lg p-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold">{userScore}%</p>
            <p className="text-xs text-muted-foreground">Your score</p>
          </div>
          <div className="text-center font-bold text-xl">vs</div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold">{opponentScore}%</p>
            <p className="text-xs text-muted-foreground">{opponent.username}'s score</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-muted space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Battle Time:</span>
            <span>{formatTime(timeSpent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Experience Gained:</span>
            <span className="text-green-500">+{getExpGain()} XP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rating Change:</span>
            <span className={getRatingChange() >= 0 ? 'text-green-500' : 'text-red-500'}>
              {getRatingChange() >= 0 ? '+' : ''}{getRatingChange()}
            </span>
          </div>
        </div>
      </motion.div>
      
      {!location.state?.mode || location.state?.mode !== 'friend' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center" 
            onClick={handleAddFriend}
            disabled={addingFriend}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {addingFriend ? 'Adding...' : `Add ${opponent.username} as Friend`}
          </Button>
        </motion.div>
      ) : null}
      
      <motion.div 
        className="grid grid-cols-1 gap-4 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Button onClick={handleNewBattle}>
          <RotateCw className="mr-2 h-4 w-4" />
          New Battle
        </Button>
        <Button variant="outline" onClick={handleViewDashboard}>
          <BarChart2 className="mr-2 h-4 w-4" />
          View Dashboard
        </Button>
        <Button variant="ghost" onClick={handleGoHome}>
          <Home className="mr-2 h-4 w-4" />
          Return Home
        </Button>
      </motion.div>
    </div>
  );
};

export default BattleResults;
