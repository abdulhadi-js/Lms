"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { notificationsApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

type Notification = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const data = await notificationsApi.list();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    fetchNotifications();
    let socket: any;

    import('socket.io-client').then(({ io }) => {
      socket = io('http://localhost:3001');
      
      socket.on('connect', () => {
        socket.emit('identify', { role: user.role, userId: user.id });
      });

      socket.on('new-notification', (notif: Notification) => {
        setNotifications(prev => {
          // Prevent duplicates if already in list
          if (prev.find(n => n.id === notif.id)) return prev;
          return [notif, ...prev];
        });
      });
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  // Safe fallback if notifications is undefined
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.isRead).length;

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <>
      <button
        ref={bellRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-full hover:bg-surface-container transition-colors shrink-0"
      >
        <Bell className="w-5 h-5 text-on-surface hover:text-primary transition-colors cursor-pointer" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed top-16 right-4 mt-2 w-[320px] max-h-[400px] overflow-y-auto bg-surface border border-divider rounded-xl shadow-2xl z-[100] flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-divider shrink-0 sticky top-0 bg-surface z-10">
            <h3 className="font-semibold text-on-surface">Notifications</h3>
            {safeNotifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary font-medium hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-2 h-2 bg-divider rounded-full mt-2 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-divider rounded w-3/4"></div>
                      <div className="h-3 bg-divider rounded w-1/2"></div>
                      <div className="h-2 bg-divider rounded w-1/4 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error || safeNotifications.length === 0 ? (
              <div className="p-8 text-center text-body-secondary flex flex-col items-center">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p>No notifications yet</p>
                {error && <button onClick={fetchNotifications} className="text-primary text-xs mt-2 underline">Try again</button>}
              </div>
            ) : (
              <div className="flex flex-col">
                {safeNotifications.map((notif) => (
                  <div key={notif.id} className="hover:bg-surface-container-low flex p-4 border-b border-divider gap-3 items-start transition-colors">
                    <div className={`w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5 ${notif.isRead ? 'opacity-0' : 'opacity-100'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-on-surface truncate">{notif.title}</p>
                      <p className="text-xs text-body-secondary line-clamp-2 mt-0.5">{notif.body}</p>
                      <p className="text-[10px] text-body-secondary mt-1">{timeAgo(notif.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
