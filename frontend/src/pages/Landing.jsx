import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Users, Eye, TrendingUp, Play, ChevronRight } from 'lucide-react';
import API from '../services/api.js';

/* ── animated counter ─────────────────────────────────────── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── fade-up variant ──────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
});

/* ── curated art showcase images (Unsplash) ──────────────── */
const SHOWCASE = [
  { src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80', h: 'h-56', label: 'Digital Art' },
  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80', h: 'h-40', label: 'Oil Painting' },
  { src: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&q=80', h: 'h-64', label: 'Illustration' },
  { src: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=400&q=80', h: 'h-44', label: 'Photography' },
  { src: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=400&q=80', h: 'h-52', label: 'Sculpture' },
  { src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', h: 'h-36', label: 'Watercolor' },
];

const CATEGORIES = [
  { name: 'Digital Art',      color: '#6366f1', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80' },
  { name: 'Painting',         color: '#f59e0b', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80' },
  { name: 'Photography',      color: '#10b981', img: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=600&q=80' },
  { name: 'Illustration',     color: '#f43f5e', img: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&q=80' },
  { name: 'Sculpture',        color: '#8b5cf6', img: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&q=80' },
  { name: 'Watercolor',       color: '#06b6d4', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80' },
];

const TESTIMONIALS = [
  { name: 'Elena Marchetti', role: 'Concept Artist @ Ubisoft', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=elena', quote: 'ArtistHub transformed how I connect with clients. The portfolio tools are unmatched.' },
  { name: 'Kwame Adu',       role: 'Freelance Illustrator',     avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=kwame', quote: 'Sold three prints within a week of signing up. The platform just works beautifully.' },
  { name: 'Yuki Tanaka',     role: 'Watercolor Painter',        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=yuki',  quote: 'Finally a platform that feels as premium as the art we create. Absolutely stunning.' },
];

/* ── component ────────────────────────────────────────────── */
const Landing = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [trendingArtists,  setTrendingArtists]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [artRes, artistRes] = await Promise.all([
          API.get('/artworks?limit=6&sortBy=trending'),
          API.get('/artists/trending/list'),
        ]);
        setFeaturedArtworks(artRes.data.artworks);
        setTrendingArtists(artistRes.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* ═══════════════════════════════════════════════════════
          1. CINEMATIC HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-5"
            style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.5) 0%, transparent 60%)' }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full py-20">

          {/* LEFT — editorial copy */}
          <div>
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 mb-8">
              <div className="flex -space-x-2">
                {['#f59e0b','#6366f1','#f43f5e'].map((c,i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-obsidian-950" style={{ background: c, borderColor: '#07070d' }} />
                ))}
              </div>
              <span className="badge-gold">
                <Sparkles className="h-3 w-3" />
                12,000+ artists worldwide
              </span>
            </motion.div>

            <motion.h1 {...fadeUp(0.08)} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8">
              Where Art Finds<br />
              <span className="text-gradient-gold italic">Its Audience.</span>
            </motion.h1>

            <motion.p {...fadeUp(0.16)} className="text-base md:text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: '#76768a' }}>
              The premier portfolio platform for independent creators. Showcase your work, connect with collectors, and grow your career with tools built for serious artists.
            </motion.p>

            <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-4">
              <Link to="/explore" className="btn-gold">
                Explore Gallery
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="btn-ghost">
                Start Free Portfolio
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-8 mt-14 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { value: 12000, suffix: '+', label: 'Artworks Uploaded' },
                { value: 5000,  suffix: '+', label: 'Active Artists' },
                { value: 98,    suffix: 'k', label: 'Monthly Views' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-bold" style={{ color: '#f59e0b' }}>
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#5a5a70' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — masonry showcase grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.4,0,0.2,1] }}
            className="hidden lg:grid grid-cols-3 gap-3 max-h-[600px]"
          >
            {SHOWCASE.map((img, i) => (
              <motion.div
                key={i}
                className={`${img.h} overflow-hidden rounded-2xl relative group`}
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                  <span className="text-[10px] font-semibold text-white">{img.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: '#333342' }}
        >
          <div className="h-8 w-5 rounded-full border flex items-start justify-center pt-1.5"
            style={{ borderColor: '#333342' }}>
            <div className="h-1.5 w-1 rounded-full bg-current" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. FEATURED ARTWORKS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <motion.div {...fadeUp(0)}>
              <p className="section-label mb-3">Curated Selection</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: '#f5f0e8' }}>
                Trending Now
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.1)}>
              <Link to="/explore" className="flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#f59e0b' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fcd34d'}
                onMouseLeave={e => e.currentTarget.style.color = '#f59e0b'}
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <hr className="rule-gold mb-12" />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl shimmer" />
              ))}
            </div>
          ) : featuredArtworks.length === 0 ? (
            <div className="py-20 text-center" style={{ color: '#5a5a70' }}>
              <p className="text-sm">No artworks yet. Be the first to upload!</p>
              <Link to="/register" className="btn-gold mt-6">Start Creating</Link>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {featuredArtworks.map((art, i) => (
                <motion.div
                  key={art._id}
                  {...fadeUp(i * 0.05)}
                  className="break-inside-avoid"
                >
                  <Link to={`/artwork/${art._id}`} className="group block overflow-hidden rounded-2xl relative"
                    style={{ background: '#1a1a26', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
                    <img
                      src={art.images[0]}
                      alt={art.title}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      style={{ maxHeight: '420px' }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-between p-5"
                      style={{ background: 'linear-gradient(to top, rgba(7,7,13,0.95) 40%, rgba(7,7,13,0.3) 100%)' }}>
                      <div className="self-end">
                        {art.isForSale && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold"
                            style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                            ${art.price} · For Sale
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-display text-lg font-semibold" style={{ color: '#f5f0e8' }}>{art.title}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <img
                            src={art.artistProfile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${art.artist?.username}`}
                            className="h-6 w-6 rounded-full object-cover" alt="" />
                          <span className="text-xs" style={{ color: '#9d9dab' }}>
                            {art.artistProfile?.fullName || art.artist?.username}
                          </span>
                          <span className="ml-auto flex items-center gap-1 text-xs" style={{ color: '#76768a' }}>
                            <Eye className="h-3.5 w-3.5" /> {art.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. CATEGORIES
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="section-label mb-3">Browse by Medium</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: '#f5f0e8' }}>
              Find Your Style
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} {...fadeUp(i * 0.06)}>
                <Link
                  to={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="group relative block overflow-hidden rounded-2xl aspect-square"
                  style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
                >
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to top, rgba(7,7,13,0.9) 0%, rgba(7,7,13,0.3) 100%)` }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="h-0.5 w-6 rounded-full mb-2 transition-all duration-300 group-hover:w-full"
                      style={{ background: cat.color }} />
                    <p className="text-xs font-semibold" style={{ color: '#f5f0e8' }}>{cat.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. TRENDING ARTISTS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <motion.div {...fadeUp(0)}>
              <p className="section-label mb-3">Rising Stars</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: '#f5f0e8' }}>
                Meet the Artists
              </h2>
            </motion.div>
          </div>
          <hr className="rule-gold mb-12" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl shimmer" />
              ))}
            </div>
          ) : trendingArtists.length === 0 ? (
            <p className="text-center py-12 text-sm" style={{ color: '#5a5a70' }}>No artists yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trendingArtists.slice(0, 6).map((artist, i) => (
                <motion.div key={artist._id} {...fadeUp(i * 0.07)}>
                  <Link
                    to={`/artist/${artist.user?.username}`}
                    className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-300"
                    style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={artist.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${artist.user?.username}`}
                        className="h-16 w-16 rounded-2xl object-cover"
                        alt={artist.fullName}
                      />
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center"
                        style={{ background: '#f59e0b' }}>
                        <Star className="h-2.5 w-2.5" style={{ color: '#07070d' }} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-base font-semibold truncate" style={{ color: '#f5f0e8' }}>{artist.fullName}</h4>
                      <p className="text-xs mt-0.5 truncate" style={{ color: '#5a5a70' }}>@{artist.user?.username}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#76768a' }}>
                          <Users className="h-3 w-3" />
                          {artist.followersCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#76768a' }}>
                          <Eye className="h-3 w-3" />
                          {artist.views || 0}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: '#f59e0b' }} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. STAT BAND
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-5 md:px-8 my-8" style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(99,102,241,0.05) 100%)',
        borderTop: '1px solid rgba(245,158,11,0.1)',
        borderBottom: '1px solid rgba(245,158,11,0.1)',
      }}>
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Eye,        target: 120000, suffix: '+', label: 'Monthly Gallery Views' },
            { icon: Users,      target: 5000,   suffix: '+', label: 'Registered Artists' },
            { icon: Star,       target: 98,     suffix: '%', label: 'Artist Satisfaction' },
            { icon: TrendingUp, target: 840,    suffix: '+', label: 'Sales This Month' },
          ].map(({ icon: Icon, target, suffix, label }, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)}>
              <Icon className="h-6 w-6 mx-auto mb-3" style={{ color: '#f59e0b' }} />
              <div className="font-display text-3xl md:text-4xl font-bold" style={{ color: '#f5f0e8' }}>
                <Counter target={target} suffix={suffix} />
              </div>
              <p className="text-xs mt-2" style={{ color: '#5a5a70' }}>{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. TESTIMONIALS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="section-label mb-3">Community Stories</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: '#f5f0e8' }}>
              Artists Love ArtistHub
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}>
                <div className="h-full p-7 rounded-2xl flex flex-col gap-5"
                  style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" style={{ color: '#f59e0b' }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 font-display italic" style={{ color: '#9d9dab' }}>
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
                    <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" style={{ background: '#333342' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#f5f0e8' }}>{t.name}</p>
                      <p className="text-[10px]" style={{ color: '#5a5a70' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. FINAL CTA BAND
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-5 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 65%)' }} />
        </div>

        <motion.div {...fadeUp(0)} className="relative mx-auto max-w-3xl text-center">
          <p className="section-label mb-6">Begin Your Journey</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ color: '#f5f0e8' }}>
            Your Art Deserves<br />
            <span className="text-gradient-gold italic">the World's Stage.</span>
          </h2>
          <p className="text-base mb-10" style={{ color: '#76768a' }}>
            Join thousands of artists who have transformed their passion into a thriving creative career.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-gold text-base px-8 py-4">
              Create Free Portfolio
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/explore" className="btn-ghost text-base px-8 py-4">
              Browse Gallery
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Landing;
