import { useState } from 'react';
import { Search, GamepadIcon, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function FriendChallenge({ battleType, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);

  const allFriends = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/api/placeholder/100/100",
      status: "online",
      game: "Playing Fortnite"
    },
    {
      id: 2,
      name: "Taylor Swift",
      avatar: "/api/placeholder/100/100",
      status: "online",
      game: "Playing Minecraft"
    },
    {
      id: 3,
      name: "Jordan Lee",
      avatar: "/api/placeholder/100/100",
      status: "online",
      game: null
    }
  ];

  const onlineFriends = allFriends.filter(friend =>
    friend.status === 'online' &&
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/80 via-gray-900/80 to-gray-800/80 backdrop-blur-sm">
      {!selectedFriend ? (
        <Card className="relative w-full max-w-md bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 text-gray-400 hover:bg-gray-800/50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-100">
              Challenge a Friend
            </CardTitle>
            <p className="text-sm text-gray-400">
              Select an online friend to start a {battleType} battle
            </p>
          </CardHeader>

          <CardContent>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
              <Input
                type="text"
                placeholder="Search online friends..."
                className="pl-10 pr-4 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus-visible:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <Badge variant="outline" className="bg-gray-800 text-green-400 border-green-500 flex gap-2 items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span>{onlineFriends.length} Online</span>
              </Badge>
            </div>

            <div className="overflow-y-auto max-h-96 space-y-3">
              {onlineFriends.length > 0 ? (
                onlineFriends.map(friend => (
                  <div 
                    key={friend.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors border border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="border border-gray-700">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback className="bg-gray-700">{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{friend.name}</h3>
                        <p className="text-sm text-gray-400">
                          {friend.game ? friend.game : 'Online'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <GamepadIcon size={16} />
                      <span>Challenge</span>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 border border-gray-800 rounded-lg bg-gray-900/30">
                  <p>No online friends found</p>
                  {searchQuery && <p className="text-sm mt-2">Try a different search term</p>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="relative w-full max-w-sm bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 text-gray-400 hover:bg-gray-800/50"
            onClick={() => setSelectedFriend(null)}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-100">
              Challenge {selectedFriend.name}
            </CardTitle>
            <p className="text-sm text-gray-400">
              Send a {battleType} battle request
            </p>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-gray-800/30 border border-gray-800">
              <Avatar className="border border-gray-700">
                <AvatarImage src={selectedFriend.avatar} alt={selectedFriend.name} />
                <AvatarFallback className="bg-gray-700">{selectedFriend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-white">{selectedFriend.name}</h3>
                <p className="text-sm text-gray-400">
                  {selectedFriend.game ? selectedFriend.game : 'Online'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="bg-gray-800/50 hover:bg-gray-800 text-white border-gray-700"
                onClick={() => setSelectedFriend(null)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setSelectedFriend(null);
                }}
              >
                Send Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}