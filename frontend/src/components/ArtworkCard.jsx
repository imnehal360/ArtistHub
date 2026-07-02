import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, DollarSign } from 'lucide-react';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const ArtworkCard = ({ artwork, index = 0 }) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(artwork.likesCount || 0);
  const [isLiked,    setIsLiked]    = useState(artwork.isLiked || false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await API.post(`/artworks/${artwork._id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch {}
  };

  const img        = artwork.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80';
  const artistName = artwork.artistProfile?.fullName || `@${artwork.artist?.username}`;
  const avatarSrc  = artwork.artistProfile?.avatar   || `https://api.dicebear.com/7.x/initials/svg?seed=${artwork.artist?.username}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.4,0,0.2,1] }}
      className="group relative break-inside-avoid"
    >
      {/* Image + hover overlay */}
      <Link to={`/artwork/${artwork._id}`}
        className="block relative overflow-hidden rounded-2xl"
        style={{ background: 'rgba(14,14,32,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.7)' }}>

        <img
          src={img}
          alt={artwork.title}
          loading="lazy"
          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ maxHeight: '500px', minHeight: '160px' }}
        />

        {/* Teal glow border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(0,217,255,0.3)' }} />

        {/* For-sale badge */}
        {artwork.isForSale && (
          <div className="absolute top-3 left-3 z-10">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: 'rgba(255,77,109,0.18)', color: '#ff8fa3', border: '1px solid rgba(255,77,109,0.35)', backdropFilter: 'blur(8px)' }}>
              <DollarSign className="h-3 w-3" />
              ${artwork.price}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-400"
          style={{ background: 'linear-gradient(to top, rgba(3,3,9,0.97) 35%, rgba(3,3,9,0.2) 100%)' }}>
          {/* Like button */}
          <div className="flex justify-end">
            <button
              onClick={handleLike}
              className="h-8 w-8 flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                background: isLiked ? 'rgba(255,77,109,0.15)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${isLiked ? 'rgba(255,77,109,0.5)' : 'rgba(255,255,255,0.12)'}`,
                color: isLiked ? '#ff4d6d' : 'var(--text-2)',
              }}
              aria-label="Like"
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom info */}
          <div>
            <h3 className="font-display text-sm font-bold leading-snug mb-2.5" style={{ color: 'var(--text-0)' }}>
              {artwork.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={avatarSrc} alt={artistName} className="h-5 w-5 rounded-full object-cover" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-2)' }}>{artistName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-3)' }}>
                  <Eye className="h-3 w-3" /> {artwork.views || 0}
                </span>
                <span className="flex items-center gap-1 text-[10px]" style={{ color: isLiked ? '#ff4d6d' : 'var(--text-3)' }}>
                  <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} /> {likesCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 px-1">
        <Link to={`/artist/${artwork.artist?.username}`} className="flex items-center gap-2">
          <img src={avatarSrc} alt={artistName} className="h-6 w-6 rounded-full object-cover" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-xs font-medium transition-colors" style={{ color: 'var(--text-3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--teal)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          >{artistName}</span>
        </Link>

        {artwork.category && (
          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(0,217,255,0.06)', color: 'var(--text-3)', border: '1px solid rgba(0,217,255,0.1)' }}>
            {artwork.category}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
