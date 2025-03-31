
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Search, User, X, Clock } from 'lucide-react';

// Mock data - replace with actual API calls
const mockFriends = [
  { id: 1, username: 'CodeNinja', status: 'online' },
  { id: 2, username: 'WebWizard', status: 'offline' },
  { id: 3, username: 'AlgorithmAce', status: 'online' },
  { id: 4, username: 'DevDragon', status: 'online' },
  { id: 5, username: 'BugHunter', status: 'offline' },
];

const mockRequests = [
  { id: 101, username: 'TypeMaster', avatar: null },
  { id: 102, username: 'CSSWizard', avatar: null },
];

const FriendsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friendUsername, setFriendUsername] = useState('');
  const { toast } = useToast();
  
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
  
  const handleAcceptRequest = (id: number, username: string) => {
    // Mock API call - replace with actual implementation
    toast({
      title: "Friend request accepted",
      description: `You are now friends with ${username}`,
    });
  };
  
  const handleRejectRequest = (id: number, username: string) => {
    // Mock API call - replace with actual implementation
    toast({
      title: "Friend request rejected",
      description: `You rejected the friend request from ${username}`,
    });
  };
  
  const handleRemoveFriend = (id: number, username: string) => {
    // Mock API call - replace with actual implementation
    toast({
      title: "Friend removed",
      description: `${username} has been removed from your friends list`,
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      
      <div className="space-y-6">
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
        
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {mockRequests.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full text-xs px-2 py-1">
                  {mockRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="friends" className="mt-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search friends"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              {filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <div 
                    key={friend.id} 
                    className="flex items-center justify-between p-4 rounded-md bg-muted/20"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted mr-3">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{friend.username}</p>
                        <p className={`text-xs ${friend.status === 'online' ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {friend.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {friend.status === 'online' && (
                        <Button variant="outline" size="sm">
                          Challenge
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveFriend(friend.id, friend.username)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No friends found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="mt-6">
            {mockRequests.length > 0 ? (
              <div className="space-y-3">
                {mockRequests.map(request => (
                  <div 
                    key={request.id} 
                    className="flex items-center justify-between p-4 rounded-md bg-muted/20"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted mr-3">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{request.username}</p>
                        <p className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending request
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAcceptRequest(request.id, request.username)}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleRejectRequest(request.id, request.username)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending friend requests</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FriendsPage;
