import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ArtworkCard from '../components/ArtworkCard.jsx';
import {
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  UserPlus,
  UserCheck,
  MessageSquare,
  Bookmark,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ArtistProfile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery'); // gallery, collections

  // Contact artist messaging state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Collection creation state
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDesc, setCollectionDesc] = useState('');
  const [collectionPrivate, setCollectionPrivate] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/artists/profile/${username}?userId=${user?._id || ''}`);
      setProfileData(res.data.profile);
      setIsFollowing(res.data.isFollowing);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await API.post(`/artists/${profileData.user._id}/follow`);
      setIsFollowing(res.data.following);
      // Locally increment/decrement followers count
      setProfileData((prev) => ({
        ...prev,
        followersCount: res.data.following ? prev.followersCount + 1 : prev.followersCount - 1
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (messageText.trim() === '') return;

    setSendingMessage(true);
    try {
      await API.post('/messages', {
        recipientId: profileData.user._id,
        text: messageText
      });
      alert('Message sent successfully!');
      setMessageText('');
      setContactModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      await API.post('/collections', {
        name: collectionName,
        description: collectionDesc,
        isPrivate: collectionPrivate
      });
      alert('Collection created successfully!');
      setCollectionName('');
      setCollectionDesc('');
      setCollectionModalOpen(false);
      fetchProfile(); // reload collections tab
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create collection');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin border-t-2 border-brand-500 rounded-full" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Artist profile not found.</p>
      </div>
    );
  }

  const isOwnProfile = user && user._id.toString() === profileData.user._id.toString();
  const coverUrl = profileData.coverImage || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80';
  const avatarUrl = profileData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div>
      
      {/* 1. COVER IMAGE HEADER */}
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        <img src={coverUrl} alt="Cover image" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
      </div>

      {/* 2. PROFILE INFO SECTION */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 relative -mt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          
          <div className="flex flex-col items-center text-center md:flex-row md:items-end md:text-left gap-4">
            <img
              src={avatarUrl}
              alt={profileData.fullName}
              className="h-32 w-32 rounded-full border-4 border-white bg-slate-100 object-cover dark:border-brand-950 shadow-lg"
            />
            <div className="mb-2">
              <h1 className="font-display text-2xl font-extrabold text-slate-800 dark:text-white md:text-3xl">
                {profileData.fullName}
              </h1>
              <p className="text-xs text-slate-400 mt-1">@{profileData.username}</p>
              
              {/* Followers counters */}
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-500">
                <span><strong>{profileData.followersCount}</strong> Followers</span>
                <span><strong>{profileData.followingCount}</strong> Following</span>
                <span><strong>{profileData.totalLikes}</strong> Likes</span>
                <span><strong>{profileData.views}</strong> Views</span>
              </div>
            </div>
          </div>

          {/* Follow & Message Buttons */}
          <div className="mb-2 flex items-center justify-center gap-3">
            {isOwnProfile ? (
              <button
                onClick={() => navigate('/dashboard/settings')}
                className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-white/10 dark:text-slate-300 transition-all"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollowToggle}
                  className={`rounded-full px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      : 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/10'
                  }`}
                >
                  {isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>

                <button
                  onClick={() => setContactModalOpen(true)}
                  className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-white/10 dark:text-slate-300 flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3. BIO & SOCIAL LINKS BAR */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left bio card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 dark:border-white/5 dark:bg-slate-900 shadow-sm">
              <h3 className="font-display text-sm font-semibold text-slate-800 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
                About Artist
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {profileData.bio || 'No bio listed yet.'}
              </p>

              {/* Skills tags */}
              {profileData.skills && profileData.skills.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Skills</h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profileData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800 flex items-center gap-4 text-slate-400">
                {profileData.socialLinks?.website && (
                  <a href={profileData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {profileData.socialLinks?.instagram && (
                  <a href={`https://instagram.com/${profileData.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {profileData.socialLinks?.twitter && (
                  <a href={`https://twitter.com/${profileData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {profileData.socialLinks?.linkedin && (
                  <a href={`https://linkedin.com/in/${profileData.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right portfolio workspace tabs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs selection */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 border-b-2 px-6 py-3 text-xs font-semibold transition-all ${
                  activeTab === 'gallery'
                    ? 'border-brand-500 text-brand-500'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                <span>Gallery ({profileData.artworks?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`flex items-center gap-2 border-b-2 px-6 py-3 text-xs font-semibold transition-all ${
                  activeTab === 'collections'
                    ? 'border-brand-500 text-brand-500'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Bookmark className="h-4 w-4" />
                <span>Collections ({profileData.collections?.length || 0})</span>
              </button>
            </div>

            {/* Gallery Grid */}
            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(!profileData.artworks || profileData.artworks.length === 0) ? (
                  <p className="col-span-full py-12 text-center text-xs text-slate-400">No artworks published to this portfolio yet.</p>
                ) : (
                  profileData.artworks.map((art) => (
                    <ArtworkCard
                      key={art._id}
                      artwork={{
                        ...art,
                        artist: { username: profileData.username },
                        artistProfile: { avatar: profileData.avatar, fullName: profileData.fullName }
                      }}
                    />
                  ))
                )}
              </div>
            )}

            {/* Collections Grid */}
            {activeTab === 'collections' && (
              <div className="space-y-4">
                {isOwnProfile && (
                  <button
                    onClick={() => setCollectionModalOpen(true)}
                    className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition-colors"
                  >
                    + Create Collection
                  </button>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(!profileData.collections || profileData.collections.length === 0) ? (
                    <p className="col-span-full py-12 text-center text-xs text-slate-400">No collections organized yet.</p>
                  ) : (
                    profileData.collections.map((col) => (
                      <div
                        key={col._id}
                        onClick={() => navigate(`/explore?category=&search=${encodeURIComponent(col.name)}`)} // redirect query search to see works
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-4 dark:border-white/5 dark:bg-slate-900 hover:shadow-md transition-all"
                      >
                        <div>
                          <h4 className="font-display text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-500">
                            {col.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1">{col.artworks?.length || 0} items</p>
                        </div>
                        {col.isPrivate && (
                          <span className="rounded bg-yellow-500/10 px-2 py-0.5 text-[8px] font-bold text-yellow-500">
                            Private
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* 4. CONTACT ARTIST MODAL DIALOG */}
      <AnimatePresence>
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            >
              <h3 className="font-display text-base font-bold">Contact {profileData.fullName}</h3>
              <p className="text-xs text-slate-400 mt-1">Send a direct message to this creator.</p>

              <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
                <textarea
                  placeholder="Say something inspiring..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows="4"
                  className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none focus:border-brand-500"
                  required
                />
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    className="rounded-full px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
                  >
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CREATE COLLECTION MODAL DIALOG */}
      <AnimatePresence>
        {collectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            >
              <h3 className="font-display text-base font-bold">Create Collection</h3>
              <form onSubmit={handleCreateCollection} className="mt-4 space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Collection Name</label>
                  <input
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none focus:border-brand-500"
                    placeholder="e.g. Concept Art"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Description</label>
                  <textarea
                    value={collectionDesc}
                    onChange={(e) => setCollectionDesc(e.target.value)}
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 text-xs text-slate-800 dark:text-slate-300 dark:border-white/10 outline-none focus:border-brand-500"
                    placeholder="e.g. Favorite conceptual ideas"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={collectionPrivate}
                    onChange={(e) => setCollectionPrivate(e.target.checked)}
                    id="is-private"
                    className="rounded border-slate-200 text-brand-500 outline-none"
                  />
                  <label htmlFor="is-private" className="text-xs text-slate-400 select-none">Make this collection private</label>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCollectionModalOpen(false)}
                    className="rounded-full px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ArtistProfile;
