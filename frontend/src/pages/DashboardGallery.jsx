import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Trash2, Eye, Heart, ArrowUpRight } from 'lucide-react';

const DashboardGallery = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyArtworks = async () => {
    setLoading(true);
    try {
      // Fetch artworks filtering by the logged-in user as artist
      const res = await API.get(`/artworks?limit=100`);
      // Filter locally for simplicity since we use the shared list route
      const myWorks = res.data.artworks.filter(
        (art) => art.artist?._id === user._id || art.artist === user._id
      );
      setArtworks(myWorks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyArtworks();
  }, [user]);

  const handleDelete = async (artId) => {
    if (!window.confirm('Are you sure you want to delete this artwork? This action is permanent.')) return;

    try {
      await API.delete(`/artworks/${artId}`);
      alert('Artwork deleted successfully.');
      setArtworks(artworks.filter((art) => art._id !== artId));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin border-t-2 border-brand-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white">My Gallery Workspace</h1>
        <p className="text-xs text-slate-400 mt-1">Review, moderate, or delete items from your public portfolio.</p>
      </div>

      {artworks.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center dark:border-white/5 dark:bg-slate-900">
          <p className="text-sm text-slate-400">You haven't uploaded any artworks yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((art) => (
            <div
              key={art._id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/5 dark:bg-slate-900 shadow-sm"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={art.images[0]}
                  alt={art.title}
                  className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute right-3 top-3 flex gap-2">
                  <a
                    href={`/artwork/${art._id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/90 p-2 text-slate-700 hover:bg-brand-500 hover:text-white shadow-sm dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-brand-500 transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(art._id)}
                    className="rounded-full bg-white/90 p-2 text-red-500 hover:bg-red-500 hover:text-white shadow-sm dark:bg-slate-800 dark:hover:bg-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-display text-sm font-semibold text-slate-800 dark:text-white truncate">{art.title}</h3>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="capitalize">{art.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{art.views}</span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{art.likesCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardGallery;
