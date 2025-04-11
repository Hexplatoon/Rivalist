// File: src/components/Navbar/postlogin/NotificationBell.jsx

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  const notifications = [
    'John sent you a friend request.',
    'You won a Codeforces battle!',
    'Reminder: CSS battle starts in 1 hour.',
    'Tom liked your Typing Battle result.',
    'You received a friend request from Emily.',
    'You lost a Typing Battle to Alex.',
    'New battle available in Codeforces mode.',
    'Mark commented on your profile.',
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative" title="Notifications">
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full text-xs flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg text-white">Notifications</DialogTitle>
        </DialogHeader>
        <ul className="space-y-2 mt-4">
          {notifications.length === 0 ? (
            <p className="text-gray-400">No new notifications.</p>
          ) : (
            notifications.map((note, index) => (
              <li
                key={index}
                className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition text-sm"
              >
                {note}
              </li>
            ))
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationBell;
