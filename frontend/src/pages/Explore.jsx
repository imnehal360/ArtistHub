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
  { value: 'latest',      label: 'LATEST' },
  { value: 'trending',    label: 'TRENDING' },
  { value: 'most-viewed', label: 'MOST VIEWED' },
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
    setPage(1);
    setArtworks([]);
    fetchArtworks(1, true);
  }, [category, isForSale, sortBy, searchParamVal]);

  useEffect(() => {
    setSearch(searchParamVal);
  }, [searchParamVal]);

  const fetchArtworks = async (pageNum, isNew = false) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);
    try {
      const q = [
        `page=${pageNum}`,
        'limit=12',
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
      if (entries[0].isIntersecting && !loadingMore) {
        const n = page + 1;
        setPage(n);
        fetchArtworks(n, false);
      }
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
    isForSale && { label: 'FOR SALE', clear: toggleSale },
    searchParamVal && { label: `"${searchParamVal.toUpperCase()}"`, clear: () => setSearchParams({ search: '', category, isForSale: isForSale.toString() }) },
  ].filter(Boolean);

  return (
    <div className="page-content min-h-screen pt-24 pb-20" style={{ background: '#000000', color: '#ffffff' }}>
      <div className="mx-auto max-w-screen-xl px-6 md:px-10">

        {/* Header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="overline mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            The Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.06 }}
            className="font-display text-5xl md:text-7xl font-bold" style={{ color: '#ffffff', letterSpacing: '0.02em' }}
          >
            EXPLORE CREATIONS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-3 text-xs tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Discover B&W imagery, physical paint medium, sketches, and photography.
          </motion.p>
        </div>

        <hr className="rule mb-8" />

        {/* Search / Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="SEARCH WORKS..."
              className="w-full pl-9 pr-4 py-2.5 rounded-none text-xs outline-none transition-all"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
          </form>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={toggleSale}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider transition-all duration-200 uppercase"
              style={{
                background: isForSale ? '#ffffff' : 'transparent',
                border: '1px solid #ffffff',
                color: isForSale ? '#000000' : '#ffffff',
                borderRadius: '9999px'
              }}
            >
              <ShoppingBag className="h-3 w-3" /> FOR SALE
            </button>

            <div className="flex items-center gap-2 px-3 py-2 text-xs"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Sliders className="h-3 w-3" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] tracking-wider uppercase font-semibold outline-none cursor-pointer"
                style={{ color: '#ffffff' }}
              >
                {SORTS.map(s => <option key={s.value} value={s.value} style={{ background: '#000000', color: '#ffffff' }}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-8">
          {CATEGORIES.map(cat => {
            const active = (cat === 'All' && !category) || category === cat;
            return (
              <button key={cat} onClick={() => selectCat(cat)}
                className="whitespace-nowrap px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 shrink-0"
                style={{
                  background: active ? '#ffffff' : 'transparent',
                  border: '1px solid #ffffff',
                  color: active ? '#000000' : 'rgba(255,255,255,0.5)',
                  borderRadius: '9999px'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((f, i) => (
              <button key={i} onClick={f.clear}
                className="flex items-center gap-1.5 px-3 py-1 rounded-none text-[9px] font-mono tracking-wider transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff' }}>
                {f.label}<X className="h-3 w-3" />
              </button>
            ))}
            <button onClick={() => { selectCat('All'); setIsForSale(false); setSearchParams({}); }}
              className="font-mono text-[9px] tracking-wider transition-colors uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              CLEAR ALL
            </button>
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="break-inside-avoid skeleton" style={{ height: `${180 + (i % 4) * 60}px` }} />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-28 text-center rounded-none mt-4"
            style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p className="font-display text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>NO ARTWORKS FOUND</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Try adjusting your filters or search term.</p>
            <button onClick={() => { selectCat('All'); setIsForSale(false); setSearchParams({}); }}
              className="btn mt-6">
              RESET FILTERS
            </button>
          </motion.div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {artworks.map((art, i) => (
                <ArtworkCard key={art._id} artwork={art} index={i} />
              ))}
            </div>
            {page < totalPages && (
              <div ref={observerRef} className="mt-14 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-4 w-4 animate-spin" style={{ color: '#ffffff' }} />
                    <span className="section-tag">LOADING MORE...</span>
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
