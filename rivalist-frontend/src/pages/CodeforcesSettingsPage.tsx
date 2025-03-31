
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CodeforcesSettings from '@/components/CodeforcesSettings';
import { ArrowLeft } from 'lucide-react';

const CodeforcesSettingsPage = () => {
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
        <div className="max-w-4xl mx-auto">
          <button 
            className="flex items-center text-muted-foreground mb-6 hover:text-foreground transition-colors"
            onClick={() => navigate('/battle/codeforces')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <CodeforcesSettings />
        </div>
      </main>
    </div>
  );
};

export default CodeforcesSettingsPage;
