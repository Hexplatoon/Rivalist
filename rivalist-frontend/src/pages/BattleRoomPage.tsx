
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BattleRoom from '@/components/BattleRoom';

const BattleRoomPage = () => {
  const { battleType } = useParams<{ battleType: string }>();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);
  
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsAuthenticated(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onOpenAuthModal={() => setIsAuthModalOpen(true)} 
      />
      
      <main className="flex-1 p-6">
        <BattleRoom battleType={battleType || ''} />
      </main>
    </div>
  );
};

export default BattleRoomPage;
