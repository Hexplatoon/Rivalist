
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  LogOut, 
  BarChart2, 
  Users
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface NavbarProps {
  isAuthenticated: boolean;
  onOpenAuthModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated,
  onOpenAuthModal 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
    // Force page reload to update auth state
    window.location.reload();
  };
  
  const getUsername = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return 'User';
    try {
      const user = JSON.parse(userStr);
      return user.username;
    } catch (e) {
      return 'User';
    }
  };
  
  return (
    <nav className="bg-muted/10 border-b border-muted/20 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Rivalist
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="hidden md:flex"
                  onClick={() => navigate('/dashboard')}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="hidden md:flex"
                  onClick={() => navigate('/friends')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Friends
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full h-9 w-9 p-0">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {getUsername()}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/friends')}>
                      <Users className="mr-2 h-4 w-4" />
                      Friends
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={onOpenAuthModal}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
