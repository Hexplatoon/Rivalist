
import React from 'react';
import { 
  Keyboard, 
  PenTool, 
  Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type BattleType = 'typing' | 'css' | 'codeforces';

interface BattleCardProps {
  type: BattleType;
  title: string;
  description: string;
  isAuthenticated: boolean;
}

const BattleCard: React.FC<BattleCardProps> = ({ 
  type, 
  title, 
  description,
  isAuthenticated
}) => {
  const navigate = useNavigate();
  
  const getIcon = () => {
    switch (type) {
      case 'typing':
        return <Keyboard className="h-8 w-8" />;
      case 'css':
        return <PenTool className="h-8 w-8" />;
      case 'codeforces':
        return <Code className="h-8 w-8" />;
    }
  };
  
  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    navigate(`/battle/${type}`);
  };
  
  return (
    <div 
      className={`battle-card battle-card-${type} cursor-pointer p-6 border-2 float-animation`}
      onClick={handleClick}
    >
      <div className="mb-4 flex justify-center">{getIcon()}</div>
      <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
      <p className="text-sm opacity-90 text-center">{description}</p>
    </div>
  );
};

export default BattleCard;
