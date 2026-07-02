import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import { Bell, Check, Heart, MessageSquare, UserPlus, Bookmark } from 'lucide-react';

const DashboardNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read');
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin border-t-2 border-brand-500 rounded-full" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 max-w-3xl text-left">
      <div className="flex items-end justify-between border-b border-slate-100 dark:border-white/5 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-brand-500" />
            Alerts & Activity ({notifications.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review feedback, follows, and messages from community</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-400"
          >
            <Check className="h-4 w-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center dark:border-white/5 dark:bg-slate-900">
          <p className="text-sm text-slate-400">You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon =
              n.type === 'like'
                ? Heart
                : n.type === 'comment'
                ? MessageSquare
                : n.type === 'follow'
                ? UserPlus
                : Bookmark;

            const iconColor =
              n.type === 'like'
                ? 'text-pink-500 bg-pink-500/10'
                : n.type === 'comment'
                ? 'text-blue-500 bg-blue-500/10'
                : n.type === 'follow'
                ? 'text-green-500 bg-green-500/10'
                : 'text-indigo-500 bg-indigo-500/10';

            return (
              <div
                key={n._id}
                className={`flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white dark:border-white/5 dark:bg-slate-900 transition-colors ${
                  !n.isRead ? 'bg-brand-500/5 border-brand-500/15' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-white">@{n.sender?.username}</strong>{' '}
                      {n.type === 'like' && 'liked your artwork'}
                      {n.type === 'comment' && 'commented on your artwork'}
                      {n.type === 'follow' && 'started following you'}
                      {n.type === 'message' && 'messaged you'}
                    </p>
                    {n.artwork && (
                      <p className="text-[10px] text-brand-500 font-semibold mt-1">
                        Artwork: {n.artwork.title}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[9px] text-slate-400">
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardNotifications;
