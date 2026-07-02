import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Paintbrush, Compass, Image, Users } from 'lucide-react';
import API from '../services/api.js';
import ArtworkCard from '../components/ArtworkCard.jsx';

const Landing = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const artRes = await API.get('/artworks?limit=4&sortBy=trending');
        setFeaturedArtworks(artRes.data.artworks);

        const artistRes = await API.get('/artists/trending/list');
        setTrendingArtists(artistRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const categories = [
    { name: 'Digital Art', count: '1.2k works', icon: Compass, color: 'from-blue-500/10 to-indigo-500/10 text-blue-500' },
    { name: 'Painting', count: '940 works', icon: Paintbrush, color: 'from-pink-500/10 to-rose-500/10 text-pink-500' },
    { name: 'Sketch', count: '820 works', icon: Image, color: 'from-amber-500/10 to-orange-500/10 text-amber-500' },
    { name: 'Photography', count: '1.5k works', icon: Users, color: 'from-emerald-500/10 to-teal-500/10 text-emerald-500' }
  ];

  return (
    <div className="overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-[90vh] items-center justify-center px-4 py-20 md:px-8 bg-gradient-to-b from-brand-950 via-slate-900 to-brand-950">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-pink-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-brand-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>The premier MERN portfolio platform for global creatives</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight"
          >
            Where Masterpieces Find <br className="hidden sm:block" />
            Their <span className="bg-gradient-to-r from-brand-400 via-pink-400 to-brand-600 bg-clip-text text-transparent">Digital Gallery</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base"
          >
            Showcase your artistic creations, connect with collectors globally, manage private client inboxes, and view advanced weekly insights—all in one premium workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/explore"
              className="group flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all hover:scale-[1.02]"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/register?role=artist"
              className="rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              Join as Artist
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED ARTWORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="flex items-end justify-between border-b border-slate-100 dark:border-white/5 pb-6">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl text-slate-800 dark:text-white">Featured Artworks</h2>
            <p className="text-xs text-slate-400 mt-1">Trending masterpieces popular this week</p>
          </div>
          <Link to="/explore" className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-400">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 w-full rounded-2xl shimmer" />
            ))
          ) : featuredArtworks.length === 0 ? (
            <p className="col-span-full py-12 text-center text-slate-400">No artworks uploaded yet.</p>
          ) : (
            featuredArtworks.map((art) => (
              <ArtworkCard key={art._id} artwork={art} />
            ))
          )}
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="bg-slate-50/50 py-20 dark:bg-brand-950/20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold md:text-3xl text-slate-800 dark:text-white">Explore by Medium</h2>
            <p className="text-xs text-slate-400 mt-1">Find the visual style that matches your aesthetic interest</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="group rounded-2xl border border-slate-100 dark:border-white/5 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:bg-slate-900 text-left"
                >
                  <div className={`inline-flex rounded-xl bg-gradient-to-br ${cat.color} p-3`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TRENDING ARTISTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl text-slate-800 dark:text-white">Trending Creators</h2>
          <p className="text-xs text-slate-400 mt-1">Connect with popular independent designers</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 w-full rounded-2xl shimmer" />
            ))
          ) : trendingArtists.length === 0 ? (
            <p className="col-span-full py-12 text-center text-slate-400">No artists registered yet.</p>
          ) : (
            trendingArtists.map((artist) => (
              <div
                key={artist._id}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-white p-5 shadow-sm dark:bg-slate-900"
              >
                <img
                  src={artist.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt={artist.fullName}
                  className="h-16 w-16 rounded-full object-cover border border-brand-500/10"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm font-bold text-slate-800 dark:text-white truncate">
                    {artist.fullName}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">@{artist.user?.username}</p>
                  <div className="mt-2 flex gap-4 text-[10px] text-slate-500">
                    <span>{artist.artworksCount || 0} Artworks</span>
                    <span>{artist.followersCount || 0} Followers</span>
                  </div>
                </div>
                <Link
                  to={`/artist/${artist.user?.username}`}
                  className="rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-semibold text-slate-700 hover:bg-brand-500 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-brand-500 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. STATISTICS */}
      <section className="bg-gradient-to-r from-brand-900 to-slate-950 py-16 text-center text-white">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-display text-3xl font-extrabold md:text-4xl text-brand-400">12k+</h3>
            <p className="text-xs text-slate-400 mt-1">Artworks Showcased</p>
          </div>
          <div>
            <h3 className="font-display text-3xl font-extrabold md:text-4xl text-pink-400">5k+</h3>
            <p className="text-xs text-slate-400 mt-1">Independent Artists</p>
          </div>
          <div>
            <h3 className="font-display text-3xl font-extrabold md:text-4xl text-brand-400">45k+</h3>
            <p className="text-xs text-slate-400 mt-1">Monthly Active Views</p>
          </div>
          <div>
            <h3 className="font-display text-3xl font-extrabold md:text-4xl text-pink-400">$120k+</h3>
            <p className="text-xs text-slate-400 mt-1">Artist Revenue Earned</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
