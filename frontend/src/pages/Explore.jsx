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

  const fetchArtworks = async (pageNum, isNew = false) => {
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
      setArtworks(prev => isNew ? res.data.artworks : [...prev, ...res.data.artworks]);
      setTotalPages(res.data.totalPages);
    } catch {}
    finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => {
    if (loading || page >= totalPages) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loadingMore) { const n = page + 1; setPage(n); fetchArtworks(n, false); }
    }, { threshold: 1 });
    if (observerRef.current) obs.observe(observerRef.current);
    return () => { if (observerRef.current) obs.unobserve(observerRef.current); };
  }, [loading, page, totalPages, loadingMore]);

  const selectCat = (cat) => {
    const c = cat === 'All' ? '' : cat;
    setCategory(c);
    setSearchParams({ search: searchParamVal, category: c, isForSale: isForSale.toString() });
  };

  const toggleSale = () => {
    const next = !isForSale;
    setIsForSale(next);
    setSearchParams({ search: searchParamVal, category, isForSale: next.toString() });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search, category, isForSale: isForSale.toString() });
  };

  const activeFilters = [
    category && category !== 'All' && { label: category, clear: () => selectCat('All') },
    isForSale && { label: 'For Sale', clear: toggleSale },
    searchParamVal && { label: `"${searchParamVal}"`, clear: () => setSearchParams({ search: '', category, isForSale: isForSale.toString() }) },
  ].filter(Boolean);

  return (
    <div className="page-content min-h-screen pt-24 pb-20" style={{ color: 'var(--text-1)' }}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* Header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="label mb-4"
          >The Gallery</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.06 }}
            className="font-display text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-0)' }}
          >
            Explore <span className="text-teal-glow">Creations</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-3 text-sm" style={{ color: 'var(--text-3)' }}
          >
            Discover extraordinary artwork from independent artists worldwide.
          </motion.p>
        </div>

        <hr className="rule mb-8" />

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: 'var(--text-3)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search artworks…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-1)' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(0,217,255,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,255,0.05)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
            />
          </form>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={toggleSale}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background: isForSale ? 'rgba(255,77,109,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isForSale ? 'rgba(255,77,109,0.4)' : 'rgba(255,255,255,0.07)'}`,
                color: isForSale ? '#ff8fa3' : 'var(--text-2)',
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5" /> For Sale
            </button>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Sliders className="h-3.5 w-3.5" style={{ color: 'var(--text-3)' }} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
                style={{ color: 'var(--text-2)' }}>
                {SORTS.map(s => <option key={s.value} value={s.value} style={{ background: '#080814' }}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-8">
          {CATEGORIES.map(cat => {
            const active = (cat === 'All' && !category) || category === cat;
            return (
              <button key={cat} onClick={() => selectCat(cat)}
                className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0"
                style={{
                  background: active ? 'linear-gradient(135deg,#00d9ff,#06b6d4)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'transparent' : 'rgba(255,255,255,0.07)'}`,
                  color: active ? '#030309' : 'var(--text-2)',
                  boxShadow: active ? '0 4px 16px rgba(0,217,255,0.25)' : 'none',
                }}
              >{cat}</button>
            );
          })}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((f, i) => (
              <button key={i} onClick={f.clear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)', color: '#67e8f9' }}>
                {f.label}<X className="h-3 w-3" />
              </button>
            ))}
            <button onClick={() => { selectCat('All'); setIsForSale(false); setSearchParams({}); }}
              className="text-[11px] font-medium transition-colors"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
            >Clear all</button>
          </div>
        )}

        {/* Gallery */}
        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="break-inside-avoid skeleton" style={{ height: `${180 + (i % 4) * 60}px` }} />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-28 text-center rounded-2xl mt-4"
            style={{ border: '1px dashed rgba(0,217,255,0.1)' }}>
            <p className="font-display text-xl font-bold mb-3" style={{ color: 'var(--text-0)' }}>No artworks found</p>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>Adjust your filters or search term.</p>
            <button onClick={() => { selectCat('All'); setIsForSale(false); setSearchParams({}); }}
              className="btn-primary mt-6">Reset Filters</button>
          </motion.div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {artworks.map((art, i) => <ArtworkCard key={art._id} artwork={art} index={i} />)}
            </div>
            {page < totalPages && (
              <div ref={observerRef} className="mt-14 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-4 w-4 animate-spin" style={{ color: '#00d9ff' }} />
                    <span className="text-xs" style={{ color: 'var(--text-3)' }}>Loading more…</span>
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
