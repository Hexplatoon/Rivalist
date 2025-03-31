
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BattleTypeSelection from '@/components/BattleTypeSelection';
import { ArrowLeft } from 'lucide-react';

const BattlePage = () => {
  const { battleType } = useParams<{ battleType: string }>();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false);
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
    
    setIsAuthenticated(true);
    // Show battle type selection as soon as the page loads
    setIsTypeSelectionOpen(true);
  }, [navigate]);
  
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsAuthenticated(true);
    setIsTypeSelectionOpen(true);
  };
  
  const getBattleTypeTitle = () => {
    switch(battleType) {
      case 'typing': return 'Typing Battle';
      case 'css': return 'CSS Design Battle';
      case 'codeforces': return 'Codeforces Duel';
      default: return 'Battle';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onOpenAuthModal={() => setIsAuthModalOpen(true)} 
      />
      
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <button 
            className="flex items-center text-muted-foreground mb-6 hover:text-foreground transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
          
          <h1 className="text-3xl font-bold mb-8">{getBattleTypeTitle()}</h1>
          
          <div className="bg-muted/10 rounded-lg p-8 text-center">
            <p className="text-xl mb-6">
              Select your battle type. Challenge random opponents online or invite your friends to a duel!
            </p>
          </div>
        </div>
      </main>
      
      <BattleTypeSelection 
        isOpen={isTypeSelectionOpen} 
        onClose={() => setIsTypeSelectionOpen(false)}
        battleType={battleType || ''}
      />
    </div>
  );
};

export default BattlePage;
