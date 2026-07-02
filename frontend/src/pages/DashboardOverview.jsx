import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Eye,
  Heart,
  Users,
  Image as ImageIcon,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/artists/dashboard/analytics');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin border-t-2 border-brand-500 rounded-full" />
      </div>
    );
  }

  const { metrics, popularArtworks, viewsHistory, followersGrowth, trafficSources } = data || {};
  const COLORS = ['#6366f1', '#ec4899', '#f97316', '#10b981'];

  const metricCards = [
    { name: 'Total Views', value: metrics?.totalViews || 0, icon: Eye, color: 'text-blue-500 bg-blue-500/10' },
    { name: 'Total Followers', value: metrics?.totalFollowers || 0, icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
    { name: 'Total Likes', value: metrics?.totalLikes || 0, icon: Heart, color: 'text-pink-500 bg-pink-500/10' },
    { name: 'Artworks', value: metrics?.totalArtworks || 0, icon: ImageIcon, color: 'text-orange-500 bg-orange-500/10' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">Workspace Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Welcome back, {user.profile?.fullName || user.username}. Here is your portfolio performance.</p>
      </div>

      {/* Grid of counter cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-white/5 dark:bg-slate-900 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{card.name}</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-slate-800 dark:text-white">
                  {card.value}
                </h3>
              </div>
              <div className={`rounded-xl p-3 ${card.color}`}>
                <IconComponent className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Views Line graph */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 shadow-sm text-left">
          <h3 className="font-display text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-brand-500" />
            Views Progression (Daily)
          </h3>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsHistory}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0b0a0f', borderColor: '#1e293b', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic sources Pie chart */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 shadow-sm text-left">
          <h3 className="font-display text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Activity className="h-4.5 w-4.5 text-brand-500" />
            Traffic Sources
          </h3>
          <div className="mt-6 h-48 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="flex items-center gap-1.5 justify-start">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <span>{source.name} ({source.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Popular Artworks */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 shadow-sm text-left">
        <h3 className="font-display text-sm font-semibold text-slate-800 dark:text-white">Popular Works</h3>
        <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
          {(!popularArtworks || popularArtworks.length === 0) ? (
            <p className="py-8 text-center text-xs text-slate-400">No popular artworks available.</p>
          ) : (
            popularArtworks.map((art) => (
              <div key={art._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={art.images[0]}
                    alt={art.title}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-display text-xs font-bold text-slate-800 dark:text-white">
                      {art.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 capitalize mt-0.5">{art.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    {art.views} Views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-slate-400" />
                    {art.likesCount} Likes
                  </span>
                  <a
                    href={`/artwork/${art._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-brand-500 hover:text-white dark:bg-slate-800 dark:hover:bg-brand-500 transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardOverview;
