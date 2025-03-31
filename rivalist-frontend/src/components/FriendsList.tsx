
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, User } from 'lucide-react';

// Mock data - replace with actual API calls
const mockFriends = [
  { id: 1, username: 'CodeNinja', status: 'online' },
  { id: 2, username: 'WebWizard', status: 'offline' },
  { id: 3, username: 'AlgorithmAce', status: 'online' },
  { id: 4, username: 'DevDragon', status: 'online' },
  { id: 5, username: 'BugHunter', status: 'offline' },
];

interface FriendsListProps {
  battleType: string;
}

const FriendsList: React.FC<FriendsListProps> = ({ battleType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friendUsername, setFriendUsername] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const filteredFriends = mockFriends.filter(friend => 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddFriend = () => {
    if (!friendUsername.trim()) return;
    
    // Mock API call - replace with actual implementation
    toast({
      title: "Friend request sent",
      description: `A friend request has been sent to ${friendUsername}`,
    });
    
    setFriendUsername('');
  };
  
  const handleChallenge = (friendId: number, username: string) => {
    // Mock API call - replace with actual implementation
    toast({
      title: "Challenge sent!",
      description: `You have challenged ${username} to a ${battleType} battle!`,
    });
    
    // Navigate to waiting screen
    navigate(`/battle/${battleType}/waiting`, { 
      state: { 
        mode: 'friend', 
        friendId, 
        friendName: username 
      } 
    });
  };
  
  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Challenge a Friend</h2>
        <p className="text-muted-foreground mb-6">
          Send a battle challenge to one of your friends
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="Add friend by username"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
          />
          <Button onClick={handleAddFriend}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search friends"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-2 mt-4">
          {filteredFriends.length > 0 ? (
            filteredFriends.map(friend => (
              <div 
                key={friend.id} 
                className="flex items-center justify-between p-3 rounded-md bg-muted/40"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{friend.username}</p>
                    <p className={`text-xs ${friend.status === 'online' ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {friend.status}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={friend.status !== 'online'}
                  onClick={() => handleChallenge(friend.id, friend.username)}
                >
                  Challenge
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No friends found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
