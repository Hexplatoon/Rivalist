import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Search, UserPlus, Check, X, Users, Clock, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from './AuthContext';

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [isAddFriendDialogOpen, setIsAddFriendDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { user, token } = useAuth();
  const stompClient = useRef(null);

  // Fetch friends and pending requests
  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8081/api/friends', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch friends');
      const data = await response.json();
      setFriends(data);
      setError(null);
    } catch (err) {
      setError('Error fetching friends. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/friends/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch pending requests');
      const data = await response.json();
      setPendingRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();

    // Setup STOMP client
    const setupWebSocketConnection = () => {
      const client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        client.subscribe('/user/topic/notifications', message => {
          try {
            const data = JSON.parse(message.body);
            if (data.senderUsername) {
              handleStatusUpdate(data.senderUsername);
            }
          } catch (err) {
            console.error('Error parsing status update:', err);
          }
        });
      };

      client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
      };

      client.activate();
      stompClient.current = client;
    };

    setupWebSocketConnection();

    // Cleanup on unmount
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [token]);

  // Handle status update notification
  const handleStatusUpdate = (username) => {
    setFriends(prevFriends =>
      prevFriends.map(friend => {
        if (friend.username === username) {
          return { ...friend, isOnline: true };
        }
        return friend;
      })
    );

    setNotification(`${username} is now online`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle friend request actions
  const handleAcceptRequest = async (username) => {
    try {
      const response = await fetch(`http://localhost:8081/api/friends/request/${username}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to accept request');

      setNotification(`Friend request from ${username} accepted!`);
      fetchFriends();
      fetchPendingRequests();
    } catch (err) {
      setError('Error accepting friend request. Please try again.');
      console.error(err);
    }
  };

  const handleDeclineRequest = async (username) => {
    try {
      const response = await fetch(`http://localhost:8081/api/friends/request/${username}/decline`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to decline request');

      setNotification(`Friend request from ${username} declined`);
      fetchPendingRequests();
    } catch (err) {
      setError('Error declining friend request. Please try again.');
      console.error(err);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!newFriendUsername.trim()) return;

    try {
      const response = await fetch('http://localhost:8081/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newFriendUsername }),
      });

      if (!response.ok) throw new Error('Failed to send friend request');

      setNotification(`Friend request sent to ${newFriendUsername}!`);
      setNewFriendUsername('');
      setIsAddFriendDialogOpen(false);
    } catch (err) {
      setError('Error sending friend request. Please try again.');
      console.error(err);
    }
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => {
    const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
    const username = friend.username.toLowerCase();
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || username.includes(query);
  });

  // Separate online and offline friends
  const onlineFriends = filteredFriends.filter(friend => friend.status == "ONLINE");
  const offlineFriends = filteredFriends.filter(friend => friend.status == "OFFLINE");

  console.log(friends);

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mt-10 mb-6">Friends</h1>

      {/* Notification */}
      {notification && (
        <Alert className="mb-4 bg-green-50">
          <AlertTitle>Notification</AlertTitle>
          <AlertDescription>{notification}</AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <Alert className="mb-4 bg-red-50" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main tabs */}
      <Tabs defaultValue="friends">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="friends" className="px-4">
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="pending" className="px-4">
              <Clock className="w-4 h-4 mr-2" />
              Pending
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-red-500">{pendingRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchFriends();
                fetchPendingRequests();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            <Dialog open={isAddFriendDialogOpen} onOpenChange={setIsAddFriendDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Friend</DialogTitle>
                  <DialogDescription>
                    Enter the username of the person you want to add as a friend.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="Username"
                  value={newFriendUsername}
                  onChange={(e) => setNewFriendUsername(e.target.value)}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddFriendDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendFriendRequest}>
                    Send Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Friends tab content */}
        <TabsContent value="friends">
          <div className="flex mb-4 dark">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div>
              {/* Online Friends */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Online ({onlineFriends.length})
                </h2>

                {onlineFriends.length === 0 ? (
                  <p className="text-gray-500 italic">No online friends</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {onlineFriends.map(friend => (
                      <FriendCard key={friend.id} friend={friend} isOnline={true} />
                    ))}
                  </div>
                )}
              </div>

              {/* Offline Friends */}
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  Offline ({offlineFriends.length})
                </h2>

                {offlineFriends.length === 0 ? (
                  <p className="text-gray-500 italic">No offline friends</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offlineFriends.map(friend => (
                      <FriendCard key={friend.id} friend={friend} isOnline={false} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Pending tab content */}
        <TabsContent value="pending">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No pending friend requests</h3>
              <p className="text-gray-500 mt-2">When someone sends you a friend request, it will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map(request => (
                <Card key={request.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {request.firstName?.charAt(0)}{request.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {request.firstName} {request.lastName}
                        </CardTitle>
                        <CardDescription>@{request.username}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeclineRequest(request.username)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRequest(request.username)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Friend Card Component
function FriendCard({ friend, isOnline }) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar>
              <AvatarFallback>
                {friend.firstName?.charAt(0)}{friend.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
            )}
          </div>
          <div>
            <CardTitle className="text-lg">
              {friend.firstName} {friend.lastName}
            </CardTitle>
            <CardDescription>@{friend.username}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm">
          Message
        </Button>
      </CardFooter>
    </Card>
  );
}