
import React, { useState } from 'react';
import { Users, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BattleTypeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  battleType: string;
}

const BattleTypeSelection: React.FC<BattleTypeSelectionProps> = ({ 
  isOpen, 
  onClose, 
  battleType 
}) => {
  const navigate = useNavigate();
  
  const handleRandomBattle = () => {
    if (battleType === 'codeforces') {
      // Open CodeForces settings
      onClose();
      navigate(`/battle/${battleType}/settings`);
    } else {
      // Direct to matchmaking
      onClose();
      navigate(`/battle/${battleType}/matchmaking`, { state: { mode: 'random' } });
    }
  };
  
  const handleFriendlyBattle = () => {
    onClose();
    navigate(`/battle/${battleType}/friends`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl mb-4">
            Select Battle Type
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 p-4">
          <Button 
            variant="outline" 
            className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-muted/50"
            onClick={handleRandomBattle}
          >
            <Users className="h-8 w-8" />
            <span>Random Online Battle</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-muted/50"
            onClick={handleFriendlyBattle}
          >
            <User className="h-8 w-8" />
            <span>Challenge a Friend</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BattleTypeSelection;
