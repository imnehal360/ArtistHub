import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, DollarSign } from 'lucide-react';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const ArtworkCard = ({ artwork }) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(artwork.likesCount || 0);
  const [isLiked, setIsLiked] = useState(() => {
    // If the backend returned likes array or isLiked flag
    return artwork.isLiked || false;
  });

  const handleLikeClick = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to like artworks.');
      return;
    }
    try {
      const res = await API.post(`/artworks/${artwork._id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error(err);
    }
  };

  const firstImage = artwork.images[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=500&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5"
    >
      <Link to={`/artwork/${artwork._id}`} className="block overflow-hidden">
        {/* Artwork Image */}
        <img
          src={firstImage}
          alt={artwork.title}
          loading="lazy"
          className="h-64 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Info Overlay (visible on hover) */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="font-display text-base font-semibold text-white truncate">{artwork.title}</h3>
          
          <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
            <span className="capitalize">{artwork.category}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {artwork.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {likesCount}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Card Footer Details */}
      <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-white/5">
        <Link
          to={`/artist/${artwork.artistProfile?.fullName ? artwork.artist?.username : artwork.artist?.username}`}
          className="flex items-center gap-2 group/author"
        >
          <img
            src={artwork.artistProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
            alt="Artist Avatar"
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-xs font-semibold text-slate-700 group-hover/author:text-brand-500 dark:text-slate-300 dark:group-hover/author:text-white">
            {artwork.artistProfile?.fullName || `@${artwork.artist?.username}`}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {artwork.isForSale && (
            <span className="flex items-center text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
              <DollarSign className="h-3 w-3" />
              <span>${artwork.price}</span>
            </span>
          )}

          <button
            onClick={handleLikeClick}
            className={`rounded-full p-1.5 transition-colors ${
              isLiked
                ? 'bg-brand-500/10 text-brand-500'
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700'
            }`}
          >
            <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
