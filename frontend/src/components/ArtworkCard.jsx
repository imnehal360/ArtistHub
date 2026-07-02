import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';
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
      {/* Image frame */}
      <Link to={`/artwork/${artwork._id}`} className="block relative overflow-hidden frame">
        <img
          src={img}
          alt={artwork.title}
          loading="lazy"
          className="w-full object-cover bw transition-all duration-700 group-hover:opacity-90"
          style={{ maxHeight: '500px', minHeight: '160px' }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.78)' }}>

          {/* Top actions */}
          <div className="flex items-start justify-between">
            {artwork.isForSale && (
              <span className="badge">${artwork.price} · For Sale</span>
            )}
            <button
              onClick={handleLike}
              className="ml-auto h-8 w-8 flex items-center justify-center transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: isLiked ? '#fff' : 'rgba(255,255,255,0.5)' }}
              aria-label="Like"
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom info */}
          <div>
            <p className="font-display text-xl text-white mb-2">{artwork.title.toUpperCase()}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={avatarSrc} alt={artistName} className="h-5 w-5 object-cover bw" style={{ borderRadius: '50%' }} />
                <span className="section-tag">{artistName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 section-tag">
                  <Eye className="h-3 w-3" /> {artwork.views || 0}
                </span>
                <span className="flex items-center gap-1 section-tag">
                  <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} /> {likesCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 px-0.5">
        <Link to={`/artist/${artwork.artist?.username}`}
          className="flex items-center gap-2 group/auth">
          <img src={avatarSrc} alt={artistName} className="h-5 w-5 object-cover bw" style={{ borderRadius: '50%' }} />
          <span className="font-sans text-[11px] font-medium transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >{artistName}</span>
        </Link>
        {artwork.category && (
          <span className="section-tag">{artwork.category}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
