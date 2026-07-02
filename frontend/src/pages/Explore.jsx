import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api.js';
import ArtworkCard from '../components/ArtworkCard.jsx';
import { Sliders, RefreshCw, Search, X, ShoppingBag } from 'lucide-react';

const CATEGORIES = [
  'All', 'Digital Art', 'Sketch', 'Painting', 'Watercolor', 'Portrait',
  'Anime', 'Fantasy', 'Landscape', 'Photography', 'Pixel Art', 'Character Design', 'Sculpture',
];

const SORTS = [
  { value: 'latest',      label: 'Latest' },
  { value: 'trending',    label: 'Trending' },
  { value: 'most-viewed', label: 'Most Viewed' },
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamVal   = searchParams.get('search')   || '';
  const categoryParamVal = searchParams.get('category') || '';
  const saleParamVal     = searchParams.get('isForSale') === 'true';

  const [artworks,    setArtworks]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [search,      setSearch]      = useState(searchParamVal);
  const [category,    setCategory]    = useState(categoryParamVal);
  const [isForSale,   setIsForSale]   = useState(saleParamVal);
  const [sortBy,      setSortBy]      = useState('latest');
  const observerRef = useRef(null);

  useEffect(() => {
    setPage(1); setArtworks([]);
    fetchArtworks(1, true);
  }, [category, isForSale, sortBy, searchParamVal]);

  useEffect(() => { setSearch(searchParamVal); }, [searchParamVal]);

  const fetchArtworks = async (pageNum, isNewFilter = false) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);
    try {
      const q = [
        `page=${pageNum}`, 'limit=12',
        category && category !== 'All' ? `category=${encodeURIComponent(category)}` : '',
        isForSale ? 'isForSale=true' : '',
        searchParamVal ? `search=${encodeURIComponent(searchParamVal)}` : '',
        sortBy ? `sortBy=${sortBy}` : '',
      ].filter(Boolean).join('&');

      const res = await API.get(`/artworks?${q}`);
      setArtworks(prev => isNewFilter ? res.data.artworks : [...prev, ...res.data.artworks]);
      setTotalPages(res.data.totalPages);
    } catch {}
    finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => {
    if (loading || page >= totalPages) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loadingMore) {
        const next = page + 1; setPage(next); fetchArtworks(next, false);
      }
    }, { threshold: 1 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => { if (observerRef.current) observer.unobserve(observerRef.current); };
  }, [loading, page, totalPages, loadingMore]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search, category, isForSale: isForSale.toString() });
  };

  const selectCategory = (cat) => {
    const c = cat === 'All' ? '' : cat;
    setCategory(c);
    setSearchParams({ search: searchParamVal, category: c, isForSale: isForSale.toString() });
  };

  const toggleSale = () => {
    const next = !isForSale;
    setIsForSale(next);
    setSearchParams({ search: searchParamVal, category, isForSale: next.toString() });
  };

  const activeFilters = [
    category && category !== 'All' && { label: category, clear: () => selectCategory('All') },
    isForSale && { label: 'For Sale', clear: toggleSale },
    searchParamVal && { label: `"${searchParamVal}"`, clear: () => setSearchParams({ search: '', category, isForSale: isForSale.toString() }) },
  ].filter(Boolean);

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* ── PAGE HEADER ─────────────────────────────────── */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="section-label mb-3"
          >
            The Gallery
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.06 }}
            className="font-display text-4xl md:text-5xl font-bold"
            style={{ color: '#f5f0e8' }}
          >
            Explore Creations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-3 text-sm" style={{ color: '#5a5a70' }}
          >
            Discover extraordinary artwork from independent artists worldwide.
          </motion.p>
        </div>

        <hr className="rule-gold mb-8" />

        {/* ── FILTER BAR ──────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#5a5a70' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search artworks…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f5f0e8' }}
              onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.4)'}
              onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </form>

          <div className="flex items-center gap-3 flex-wrap">
            {/* For Sale */}
            <button onClick={toggleSale}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background: isForSale ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isForSale ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: isForSale ? '#fcd34d' : '#9d9dab',
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              For Sale
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Sliders className="h-3.5 w-3.5" style={{ color: '#5a5a70' }} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                style={{ color: '#9d9dab' }}
              >
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── CATEGORY PILLS ──────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-8">
          {CATEGORIES.map(cat => {
            const active = (cat === 'All' && !category) || category === cat;
            return (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 shrink-0"
                style={{
                  background: active ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? '#07070d' : '#9d9dab',
                  boxShadow: active ? '0 4px 16px rgba(245,158,11,0.2)' : 'none',
                  fontWeight: active ? '700' : '500',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE FILTER CHIPS ─────────────────────────── */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((f, i) => (
              <button key={i} onClick={f.clear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fcd34d' }}>
                {f.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button onClick={() => { selectCategory('All'); setIsForSale(false); setSearchParams({}); }}
              className="text-[11px] font-medium transition-colors"
              style={{ color: '#5a5a70' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f5f0e8'}
              onMouseLeave={e => e.currentTarget.style.color = '#5a5a70'}
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── GALLERY ─────────────────────────────────────── */}
        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="break-inside-avoid rounded-2xl shimmer"
                style={{ height: `${180 + (i % 4) * 60}px` }} />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-28 text-center rounded-2xl mt-4"
            style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <p className="font-display text-xl font-semibold mb-3" style={{ color: '#f5f0e8' }}>No artworks found</p>
            <p className="text-sm" style={{ color: '#5a5a70' }}>Try adjusting your filters or search term.</p>
            <button onClick={() => { selectCategory('All'); setIsForSale(false); setSearchParams({}); }}
              className="btn-gold mt-6">Reset Filters</button>
          </motion.div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
              {artworks.map((art, i) => (
                <ArtworkCard key={art._id} artwork={art} index={i} />
              ))}
            </div>

            {page < totalPages && (
              <div ref={observerRef} className="mt-14 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-3" style={{ color: '#5a5a70' }}>
                    <RefreshCw className="h-4 w-4 animate-spin" style={{ color: '#f59e0b' }} />
                    <span className="text-xs">Loading more…</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
