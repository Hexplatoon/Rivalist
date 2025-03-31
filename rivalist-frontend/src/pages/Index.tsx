
import React, { useState, useEffect } from 'react';
import BattleCard from '@/components/BattleCard';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { motion } from 'framer-motion';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);
  
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsAuthenticated(true);
  };
  
  const battleTypes = [
    {
      type: 'typing',
      title: 'Typing Battle',
      description: 'Test your typing speed and accuracy against opponents'
    },
    {
      type: 'css',
      title: 'CSS Design',
      description: 'Create stunning designs with your CSS skills'
    },
    {
      type: 'codeforces',
      title: 'Codeforces Duel',
      description: 'Solve algorithmic problems faster than your opponent'
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onOpenAuthModal={() => setIsAuthModalOpen(true)} 
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Welcome to Rivalist
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Challenge your skills in typing, CSS design, and algorithmic problem solving in 1v1 battles
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {battleTypes.map((battle, index) => (
            <motion.div
              key={battle.type}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
            >
              <BattleCard
                type={battle.type as 'typing' | 'css' | 'codeforces'}
                title={battle.title}
                description={battle.description}
                isAuthenticated={isAuthenticated}
              />
            </motion.div>
          ))}
        </motion.div>
      </main>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
