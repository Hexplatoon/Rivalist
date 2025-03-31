
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FriendsPage from '@/components/FriendsPage';

const FriendsPageWrapper = () => {
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
        <FriendsPage />
      </main>
    </div>
  );
};

export default FriendsPageWrapper;
