import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api.js';
import ArtworkCard from '../components/ArtworkCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { Filter, Sliders, RefreshCw, Grid } from 'lucide-react';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchParamVal = searchParams.get('search') || '';
  const categoryParamVal = searchParams.get('category') || '';
  const saleParamVal = searchParams.get('isForSale') === 'true';

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // States
  const [search, setSearch] = useState(searchParamVal);
  const [category, setCategory] = useState(categoryParamVal);
  const [isForSale, setIsForSale] = useState(saleParamVal);
  const [sortBy, setSortBy] = useState('latest'); // latest, trending, most-viewed

  const observerRef = useRef(null);

  const categories = [
    'All',
    'Digital Art',
    'Sketch',
    'Painting',
    'Watercolor',
    'Portrait',
    'Anime',
    'Fantasy',
    'Landscape',
    'Photography',
    'Pixel Art',
    'Character Design',
    'Sculpture'
  ];

  // Fetch initial artworks on filter adjustments
  useEffect(() => {
    setPage(1);
    setArtworks([]);
    fetchArtworks(1, true);
  }, [category, isForSale, sortBy, searchParamVal]);

  // Sync URL search edits
  useEffect(() => {
    setSearch(searchParamVal);
  }, [searchParamVal]);

  const fetchArtworks = async (pageNum, isNewFilter = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const qCategory = category && category !== 'All' ? `&category=${encodeURIComponent(category)}` : '';
      const qSale = isForSale ? `&isForSale=true` : '';
      const qSearch = searchParamVal ? `&search=${encodeURIComponent(searchParamVal)}` : '';
      const qSort = sortBy ? `&sortBy=${sortBy}` : '';

      const res = await API.get(`/artworks?page=${pageNum}&limit=8${qCategory}${qSale}${qSearch}${qSort}`);
      
      if (isNewFilter) {
        setArtworks(res.data.artworks);
      } else {
        setArtworks((prev) => [...prev, ...res.data.artworks]);
      }
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (loading || page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchArtworks(nextPage, false);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, page, totalPages, loadingMore]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search, category, isForSale: isForSale.toString() });
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat === 'All' ? '' : cat);
    setSearchParams({
      search: searchParamVal,
      category: cat === 'All' ? '' : cat,
      isForSale: isForSale.toString()
    });
  };

  const handleSaleToggle = () => {
    const nextSale = !isForSale;
    setIsForSale(nextSale);
    setSearchParams({
      search: searchParamVal,
      category,
      isForSale: nextSale.toString()
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      
      {/* 1. FILTER HEADER BAR */}
      <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-white/5 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl text-slate-800 dark:text-white flex items-center gap-2">
            <Grid className="h-6 w-6 text-brand-500" />
            Explore Creations
          </h1>
          <p className="text-xs text-slate-400 mt-1">Browse trending sketches, designs, and photographs</p>
        </div>

        {/* Filters control toggles */}
        <div className="flex flex-wrap items-center gap-3">
          
          <button
            onClick={handleSaleToggle}
            className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all ${
              isForSale
                ? 'bg-green-500/10 border-green-500 text-green-500'
                : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-white/10 dark:text-slate-300'
            }`}
          >
            For Sale Only
          </button>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-1.5 dark:bg-slate-900 dark:border-white/10">
            <Sliders className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
              <option value="most-viewed">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY HORIZONTAL FILTER SLIDER */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-3 pt-1 scroll-smooth shrink-0 no-scrollbar">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleCategorySelect(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all ${
              (cat === 'All' && !category) || category === cat
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/15'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-white/5 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. MASONRY GALLERY */}
      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <div className="mt-16 text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5">
          <p className="text-sm text-slate-400">No artworks match your query. Try resetting filters.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {artworks.map((art) => (
              <ArtworkCard key={art._id} artwork={art} />
            ))}
          </div>

          {/* Trigger point for Infinite scroll */}
          {page < totalPages && (
            <div ref={observerRef} className="mt-12 flex justify-center py-6">
              <RefreshCw className="h-6 w-6 text-brand-500 animate-spin" />
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Explore;
