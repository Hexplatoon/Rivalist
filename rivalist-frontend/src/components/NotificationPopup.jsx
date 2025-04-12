import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "./AuthContext";
import SockJS from "sockjs-client";
import * as Stomp from "stompjs";

export default function NotificationPopup({
  children,
  notifications,
  setNotifications,
}) {
  const [open, setOpen] = useState(false);
  const { user, token } = useAuth();

  console.log("NotificationPopup Render:", { user, notifications, open });

  useEffect(() => {
    console.log("WebSocket Effect - User Token:", token);

    if (!token) {
      console.warn("No user token available - WebSocket connection aborted");
      return;
    }

    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = Stomp.over(socket);

    console.log("Attempting WebSocket connection...");

    stompClient.connect(
      {
        Authorization: `Bearer ${token}`,
      },
      (frame) => {
        console.log("WebSocket Connected:", frame);

        const notificationSubscription = stompClient.subscribe(
          "/user/topic/notifications",
          (message) => {
            console.log("Received Notification:", message.body);
            try {
              const data = JSON.parse(message.body);
              console.log("Parsed Notification Data:", data.senderUsername);
              addNotification({
                id: data.id || Date.now().toString(),
                type: data.type,
                from: data.senderUsername,
                challengeId: data.challengeId,
                content: data.message,
              });
            } catch (error) {
              console.error("Error processing notification:", error);
            }
          }
        );

        const challengeSubscription = stompClient.subscribe(
          "/user/topic/challenge",
          (message) => {
            console.log("Received Challenge:", message.body);
            try {
              const data = JSON.parse(message.body);
              console.log("Parsed Challenge Data:", data);
              addNotification({
                id: `challenge-${data.challengeId}`,
                type: "challenge",
                from: data.from,
                challengeId: data.challengeId,
                content: "You received a new challenge!",
              });
            } catch (error) {
              console.error("Error processing challenge:", error);
            }
          }
        );

        console.log("Subscriptions Active:", {
          notifications: notificationSubscription.id,
          challenges: challengeSubscription.id,
        });
      },
      (error) => {
        console.error("WebSocket Connection Error:", error);
      }
    );

    return () => {
      if (stompClient?.connected) {
        console.log("Disconnecting WebSocket...");
        stompClient.disconnect();
      }
    };
  }, [token]);

  const addNotification = (notification) => {
    console.log("Adding New Notification:", notification);
    setNotifications((prev) => {
      const newNotifications = [
        ...prev,
        {
          ...notification,
          read: false,
          time: new Date().toLocaleTimeString(),
        },
      ];
      console.log("Updated Notifications:", newNotifications);
      return newNotifications;
    });
  };

  const handleAccept = async (id) => {
    console.log("Accepting Notification:", id);
    const notification = notifications.find((n) => n.id === id);
    if (!notification) {
      console.error("Notification not found:", id);
      return;
    }

    try {
      if (notification.type === "challenge" && notification.challengeId) {
        console.log("Accepting Challenge:", notification.challengeId);
        const response = await fetch(
          `http://localhost:8081/api/challenges/${notification.challengeId}/accept`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log("Challenge Accept Response:", response.status);
      } else if (notification.type === "friend_request") {
        console.log("Accepting Friend Request from:", notification);
        const response = await fetch(
          `http://localhost:8081/api/friends/request/${notification.from}/accept`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Friend Request Accept Response:", response.status);
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error accepting notification:", error);
    }
  };

  const handleDecline = async (id) => {
    console.log("Declining Notification:", id);
    const notification = notifications.find((n) => n.id === id);
    if (!notification) {
      console.error("Notification not found:", id);
      return;
    }

    try {
      if (notification.type === "challenge" && notification.challengeId) {
        console.log("Declining Challenge:", notification.challengeId);
        const response = await fetch(
          `http://localhost:8081/api/challenges/${notification.challengeId}/decline`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log("Challenge Decline Response:", response.status);
      }
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error declining notification:", error);
    }
  };

  const markAllAsRead = () => {
    console.log("Marking all notifications as read");
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  console.log("Current Notifications State:", {
    total: notifications.length,
    unread: unreadCount,
    notifications,
  });

  const getNotificationContent = (notification) => {
    switch (notification.type) {
      case "friend_request":
        return {
          title: "Friend Request",
          description: `${notification.from} sent you a friend request`,
          action: true,
        };
      case "challenge":
        return {
          title: "New Challenge",
          description: `${notification.from} challenged you to a game`,
          action: true,
        };
      case "message":
        return {
          title: "New Message",
          description: notification.content,
          action: false,
        };
      default:
        return {
          title: "Notification",
          description: notification.content,
          action: false,
        };
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white" align="end" sideOffset={5}>
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              No notifications
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => {
                const { title, description, action } =
                  getNotificationContent(notification);
                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b last:border-b-0 ${
                      !notification.read ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <AlertTitle className="text-sm font-medium">
                        {title}
                      </AlertTitle>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <AlertDescription className="text-xs text-gray-600 mb-2">
                      {description}
                    </AlertDescription>
                    {action && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 text-xs flex-1"
                          onClick={() => handleAccept(notification.id)}
                        >
                          <Check className="h-3 w-3 mr-1" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs flex-1"
                          onClick={() => handleDecline(notification.id)}
                        >
                          <X className="h-3 w-3 mr-1" /> Decline
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
