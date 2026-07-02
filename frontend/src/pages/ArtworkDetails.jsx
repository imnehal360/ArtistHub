import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ArtworkCard from '../components/ArtworkCard.jsx';
import {
  Heart,
  Share2,
  FolderPlus,
  Send,
  UserCheck,
  UserPlus,
  Calendar,
  Layers,
  Copyright,
  Maximize2,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArtworkDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [isFollowing, setIsFollowing] = useState(false);

  // Collections state
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // comment object
  
  const [relatedArtworks, setRelatedArtworks] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchArtworkDetails();
  }, [id]);

  const fetchArtworkDetails = async () => {
    setLoading(true);
    try {
      const artRes = await API.get(`/artworks/${id}?userId=${user?._id || ''}`);
      setArtwork(artRes.data);
      setIsLiked(artRes.data.isLiked);
      setLikesCount(artRes.data.likesCount);

      // Check following status of artist
      if (user && artRes.data.artist) {
        const profileRes = await API.get(`/artists/profile/${artRes.data.artist.username}?userId=${user._id}`);
        setIsFollowing(profileRes.data.isFollowing);
      }

      // Fetch related artworks
      const relatedRes = await API.get(`/artworks/${id}/related`);
      setRelatedArtworks(relatedRes.data);

      // Fetch comments
      const commentsRes = await API.get(`/comments/artwork/${id}`);
      setComments(commentsRes.data);

      // Fetch user's collections
      if (user) {
        const collectionsRes = await API.get(`/collections/user/${user._id}?userId=${user._id}`);
        setCollections(collectionsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await API.post(`/artworks/${id}/like`);
      setIsLiked(res.data.liked);
      setLikesCount((prev) => (res.data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await API.post(`/artists/${artwork.artist._id}/follow`);
      setIsFollowing(res.data.following);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection) return;
    try {
      await API.post(`/collections/${selectedCollection}/artwork`, { artworkId: id });
      alert('Artwork added to collection!');
      setCollectionModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add artwork to collection');
    }
  };

  const handleAddCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (newComment.trim() === '') return;

    try {
      const res = await API.post('/comments', {
        artworkId: id,
        content: newComment,
        parentCommentId: replyTo?._id || null
      });

      setComments((prev) => [...prev, res.data.comment]);
      setNewComment('');
      setReplyTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Build comment trees for comments component
  const getCommentThread = () => {
    const map = {};
    const roots = [];

    // Map comments to objects and append a replies key
    comments.forEach((c) => {
      map[c._id] = { ...c, replies: [] };
    });

    // Populate children or root list
    comments.forEach((c) => {
      const commentWithReplies = map[c._id];
      if (c.parentComment) {
        if (map[c.parentComment]) {
          map[c.parentComment].replies.push(commentWithReplies);
        }
      } else {
        roots.push(commentWithReplies);
      }
    });

    return roots;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin border-t-2 border-brand-500 rounded-full" />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Artwork details could not be found.</p>
      </div>
    );
  }

  const commentThreads = getCommentThread();
  const firstImage = artwork.images[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      
      {/* Grid Layout: Left is Artwork Image, Right is Details */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        
        {/* LEFT COLUMN - Artwork Large Image Viewer */}
        <div className="lg:col-span-7">
          <div className="relative group overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-white/5 dark:bg-slate-900 shadow-lg">
            <img
              src={firstImage}
              alt={artwork.title}
              className="w-full max-h-[600px] object-contain mx-auto transition-all cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            />
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute right-4 bottom-4 rounded-full bg-black/60 p-2.5 text-white hover:bg-black/80 transition-colors"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 rounded-full border px-6 py-2.5 text-xs font-semibold transition-all ${
                  isLiked
                    ? 'bg-brand-500/10 border-brand-500 text-brand-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-white/10 dark:text-slate-300'
                }`}
              >
                <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>

              {user && (
                <button
                  onClick={() => setCollectionModalOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-white/10 dark:text-slate-300 transition-all"
                >
                  <FolderPlus className="h-4.5 w-4.5" />
                  <span>Collect</span>
                </button>
              )}
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-white/10 dark:text-slate-300 transition-all"
            >
              <Share2 className="h-4.5 w-4.5" />
              <span>{copied ? 'Copied URL!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - Artwork and Artist Details */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Metadata Block */}
          <div>
            <span className="inline-block rounded-full bg-brand-500/10 px-3 py-1 text-[10px] font-bold text-brand-500 uppercase tracking-wider">
              {artwork.category}
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-slate-800 dark:text-white leading-tight">
              {artwork.title}
            </h1>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {artwork.description || 'No description provided.'}
            </p>
          </div>

          {/* Pricing block */}
          {artwork.isForSale && (
            <div className="rounded-2xl bg-green-500/5 border border-green-500/15 p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wider">Available for purchase</p>
                <h3 className="mt-1 font-display text-2xl font-extrabold text-green-600 dark:text-green-500 flex items-center">
                  <DollarSign className="h-6 w-6" />
                  {artwork.price}
                </h3>
              </div>
              <button className="rounded-xl bg-green-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-green-600 shadow-md shadow-green-500/10">
                Purchase Artwork
              </button>
            </div>
          )}

          {/* Artist Card widget */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 dark:border-white/5 dark:bg-slate-900 flex items-center justify-between gap-4 shadow-sm">
            <Link to={`/artist/${artwork.artist?.username}`} className="flex items-center gap-3">
              <img
                src={artwork.artistProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                alt="Artist Avatar"
                className="h-12 w-12 rounded-full object-cover border border-brand-500/10 animate-pulse-subtle"
              />
              <div>
                <h4 className="font-display text-sm font-bold text-slate-800 dark:text-white">
                  {artwork.artistProfile?.fullName || `@${artwork.artist?.username}`}
                </h4>
                <p className="text-[10px] text-slate-400">View profile portfolio</p>
              </div>
            </Link>

            {user?._id !== artwork.artist?._id && (
              <button
                onClick={handleFollowToggle}
                className={`rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isFollowing
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    : 'bg-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/50 text-left">
              <Calendar className="h-4 w-4 text-slate-400" />
              <p className="mt-2 text-[10px] text-slate-400 uppercase font-semibold">Creation Year</p>
              <h5 className="mt-0.5 text-xs font-bold text-slate-700 dark:text-slate-200">{artwork.creationYear}</h5>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/50 text-left">
              <Layers className="h-4 w-4 text-slate-400" />
              <p className="mt-2 text-[10px] text-slate-400 uppercase font-semibold">Medium & Size</p>
              <h5 className="mt-0.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                {artwork.medium || 'N/A'} {artwork.dimensions ? `(${artwork.dimensions})` : ''}
              </h5>
            </div>
            <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-slate-900/50 text-left flex items-center gap-3">
              <Copyright className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Copyright Protection</p>
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200">{artwork.copyrightInfo}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMMENTS & REPLIES TREE */}
      <section className="mt-16 border-t border-slate-100 pt-12 dark:border-white/5 max-w-3xl">
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-brand-500" />
          Discussions ({comments.length})
        </h2>

        {/* New Comment / Reply Form */}
        <form onSubmit={handleAddCommentSubmit} className="mt-6 flex flex-col gap-3">
          {replyTo && (
            <div className="flex items-center justify-between rounded-lg bg-brand-500/5 px-3 py-1.5 text-[10px] text-brand-500">
              <span>Replying to @{replyTo.user?.username}</span>
              <button type="button" onClick={() => setReplyTo(null)} className="font-bold hover:underline">Cancel</button>
            </div>
          )}
          <div className="relative">
            <textarea
              placeholder={replyTo ? "Write a reply..." : "Add to the discussion..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="3"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 dark:bg-slate-900 dark:border-white/10 dark:text-slate-100 outline-none focus:border-brand-500"
              required
            />
            <button
              type="submit"
              className="absolute right-3 bottom-3 rounded-full bg-brand-500 p-2 text-white hover:bg-brand-600"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* Comment Threads list */}
        <div className="mt-8 space-y-6">
          {commentThreads.map((comment) => (
            <div key={comment._id} className="space-y-4">
              <div className="flex gap-3">
                <img
                  src={comment.userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt="Commenter Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {comment.userProfile?.fullName || `@${comment.user?.username}`}
                    </span>
                    <button
                      onClick={() => setReplyTo(comment)}
                      className="text-[10px] font-semibold text-brand-500 hover:underline"
                    >
                      Reply
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>

              {/* Recursive replies wrapper */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 border-l border-slate-100 pl-4 dark:border-white/5 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="flex gap-3">
                      <img
                        src={reply.userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                        alt="Replier Avatar"
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          {reply.userProfile?.fullName || `@${reply.user?.username}`}
                        </span>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* RELATED ARTWORKS CAROUSEL */}
      {relatedArtworks.length > 0 && (
        <section className="mt-20 border-t border-slate-100 pt-12 dark:border-white/5">
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">More Related Artworks</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedArtworks.map((art) => (
              <ArtworkCard key={art._id} artwork={art} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox / Zoom Dialog Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={firstImage}
              alt="Zoomed artwork"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collection Modal Dialog */}
      <AnimatePresence>
        {collectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            >
              <h3 className="font-display text-base font-bold">Add to Collection</h3>
              <p className="text-xs text-slate-400 mt-1">Select one of your directories to save this artwork</p>
              
              <div className="mt-4">
                {collections.length === 0 ? (
                  <p className="text-xs text-slate-400">No collections found. Create a collection from your profile first!</p>
                ) : (
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10"
                  >
                    <option value="">-- Choose Collection --</option>
                    {collections.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setCollectionModalOpen(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCollection}
                  disabled={!selectedCollection}
                  className="rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  Save to Collection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ArtworkDetails;
