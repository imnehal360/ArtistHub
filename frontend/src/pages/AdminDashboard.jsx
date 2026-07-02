import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Users, Image, Heart, Eye, ArrowLeft, ShieldCheck, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data);

      const usersRes = await API.get('/admin/users');
      setUsersList(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (targetUserId, newRole) => {
    try {
      await API.put(`/admin/users/${targetUserId}/role`, { role: newRole });
      alert(`User role updated to ${newRole}`);
      // Refresh local list state
      setUsersList(prev => prev.map(u => u._id === targetUserId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Role adjustment failed');
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account? All their profiles and artworks will be lost.')) return;
    try {
      await API.delete(`/admin/users/${targetUserId}`);
      alert('User deleted.');
      setUsersList(prev => prev.filter(u => u._id !== targetUserId));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete user failed');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin border-t-2 border-brand-500 rounded-full" />
      </div>
    );
  }

  const { stats: platformStats, recentUsers } = stats || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-6.5 w-6.5 text-brand-500" />
            Admin Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review platform engagement, moderate users, and promotion tables.</p>
        </div>
        <a
          href="/"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-white/10 dark:text-slate-300"
        >
          Exit Admin
        </a>
      </div>

      {/* Grid of counter cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-white/5 dark:bg-slate-900">
          <p className="text-[9px] uppercase text-slate-400 font-bold">Total Accounts</p>
          <h3 className="mt-2 font-display text-xl font-bold">{platformStats?.totalUsers}</h3>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-white/5 dark:bg-slate-900">
          <p className="text-[9px] uppercase text-slate-400 font-bold">Artist Accounts</p>
          <h3 className="mt-2 font-display text-xl font-bold">{platformStats?.totalArtists}</h3>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-white/5 dark:bg-slate-900">
          <p className="text-[9px] uppercase text-slate-400 font-bold">Published Artworks</p>
          <h3 className="mt-2 font-display text-xl font-bold">{platformStats?.totalArtworks}</h3>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-white/5 dark:bg-slate-900">
          <p className="text-[9px] uppercase text-slate-400 font-bold">Platform Views</p>
          <h3 className="mt-2 font-display text-xl font-bold">{platformStats?.totalViews}</h3>
        </div>
      </div>

      {/* User list moderation table */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 shadow-sm overflow-hidden">
        <h3 className="font-display text-base font-bold text-slate-800 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Manage Accounts
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-500 dark:text-slate-400">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {usersList.map((usr) => (
                <tr key={usr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <img
                      src={usr.profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80'}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-white">@{usr.username}</span>
                      <p className="text-[9px] text-slate-400">{usr.profile?.fullName || '-'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">{usr.email}</td>
                  <td className="py-4 px-4 capitalize font-semibold">{usr.role}</td>
                  <td className="py-4 px-4 flex items-center gap-3">
                    {/* Role promos dropdown selector */}
                    <select
                      value={usr.role}
                      onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                      disabled={usr._id === user._id}
                      className="rounded border border-slate-200 bg-transparent px-2 py-1 text-[10px] outline-none cursor-pointer dark:border-white/10 dark:text-slate-300"
                    >
                      <option value="visitor">Visitor</option>
                      <option value="artist">Artist</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => handleDeleteUser(usr._id)}
                      disabled={usr._id === user._id}
                      className="rounded p-1 text-red-500 hover:bg-red-500/10 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
