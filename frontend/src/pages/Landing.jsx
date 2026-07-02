import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Sparkles, Star, Users, Eye, TrendingUp, ChevronRight,
  Play, Zap, Globe, Brush
} from 'lucide-react';
import API from '../services/api.js';

/* ── Animated number counter ─────────────────────────────── */
const Counter = ({ target, suffix = '', prefix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let n = 0, dur = 1800, step = Math.ceil(target / (dur / 16));
    const t = setInterval(() => {
      n += step; if (n >= target) { setVal(target); clearInterval(t); } else setVal(n);
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
};

/* ── Reveal animation helper ─────────────────────────────── */
const rev = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] },
});

/* ── Art samples ─────────────────────────────────────────── */
const HERO_IMGS = [
  { src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=420&q=80', label: 'Digital Art', accent: '#00d9ff' },
  { src: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=420&q=80', label: 'Illustration', accent: '#a855f7' },
  { src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=420&q=80', label: 'Painting',    accent: '#ff4d6d' },
  { src: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=420&q=80', label: 'Photography', accent: '#10b981' },
  { src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=420&q=80', label: 'Watercolor',  accent: '#00d9ff' },
  { src: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=420&q=80', label: 'Sculpture',   accent: '#a855f7' },
];

const CATEGORIES = [
  { name: 'Digital Art',   color: '#00d9ff', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=80' },
  { name: 'Illustration',  color: '#a855f7', img: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=700&q=80' },
  { name: 'Photography',   color: '#ff4d6d', img: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=700&q=80' },
  { name: 'Painting',      color: '#10b981', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700&q=80' },
  { name: 'Watercolor',    color: '#00d9ff', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80' },
  { name: 'Sculpture',     color: '#a855f7', img: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=700&q=80' },
];

const FEATURES = [
  { icon: Globe,    title: 'Global Reach',       desc: 'Showcase to collectors and fans from 140+ countries.', color: '#00d9ff' },
  { icon: Brush,    title: 'Stunning Portfolio',  desc: 'Curate a gorgeous, masonry-layout gallery in minutes.', color: '#a855f7' },
  { icon: Zap,      title: 'Instant Sales',       desc: 'List your art for sale and get paid without the middleman.', color: '#ff4d6d' },
  { icon: Users,    title: 'Grow Your Tribe',     desc: 'Build followers, get messages, and collaborate.', color: '#10b981' },
];

const TESTIMONIALS = [
  { name: 'Elena Marchetti', role: 'Concept Artist @ Ubisoft',  avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=elena',  quote: 'ArtistHub is the most beautiful platform I\'ve ever used. My client inquiries tripled in one month.' },
  { name: 'Kwame Adu',       role: 'Freelance Illustrator',      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=kwame',  quote: 'Sold five prints in my first week. The platform feels like it was made specifically for artists.' },
  { name: 'Yuki Tanaka',     role: 'Watercolor Artist',          avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=yuki',   quote: 'I\'ve tried every portfolio tool out there. Nothing comes close to ArtistHub\'s design and experience.' },
];

/* ── COMPONENT ───────────────────────────────────────────── */
const Landing = () => {
  const [featured, setFeatured] = useState([]);
  const [artists,  setArtists]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    (async () => {
      try {
        const [a, b] = await Promise.all([
          API.get('/artworks?limit=8&sortBy=trending'),
          API.get('/artists/trending/list'),
        ]);
        setFeatured(a.data.artworks);
        setArtists(b.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="page-content" style={{ color: 'var(--text-1)' }}>

      {/* ═══════════════════════════════════════════════════
          1 — HERO
      ═══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-16">

        {/* Moving orbs */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <div className="orb orb-teal   w-[700px] h-[700px] -top-40 -left-40 animate-drift-slow  opacity-50" />
          <div className="orb orb-violet w-[500px] h-[500px] top-1/2 -right-20 animate-drift-fast  opacity-40" />
          <div className="orb orb-coral  w-[400px] h-[400px] bottom-0 left-1/3                      opacity-30 animate-[drift_16s_ease-in-out_infinite]" />
        </motion.div>

        {/* Grid lines decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,217,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="relative mx-auto max-w-7xl px-5 md:px-8 w-full py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* ── Left: Editorial Copy ─────────────────────── */}
            <div>
              {/* Eyebrow badge */}
              <motion.div {...rev(0)} className="flex items-center gap-3 mb-8">
                <div className="badge-teal">
                  <Sparkles className="h-3 w-3" />
                  The #1 Art Platform
                </div>
                <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(90deg, rgba(0,217,255,0.5), transparent)' }} />
              </motion.div>

              {/* Headline */}
              <motion.h1 {...rev(0.08)} className="font-display leading-[1.04] mb-6"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: 'var(--text-0)' }}>
                Create Art.<br />
                <span className="text-teal-glow">Build Legacy.</span><br />
                <span style={{ color: 'var(--text-2)', fontSize: '75%', fontStyle: 'italic' }}>Inspire the World.</span>
              </motion.h1>

              <motion.p {...rev(0.15)} className="text-base md:text-lg leading-relaxed mb-10 max-w-lg"
                style={{ color: 'var(--text-2)' }}>
                The premier portfolio platform for independent creators — showcase your talent, connect with collectors, and turn your passion into a career.
              </motion.p>

              {/* CTAs */}
              <motion.div {...rev(0.2)} className="flex flex-wrap gap-4 mb-12">
                <Link to="/explore" className="btn-primary">
                  Explore Gallery <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/register" className="btn-coral">
                  Start Free <Sparkles className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* Social proof bar */}
              <motion.div {...rev(0.26)} className="flex items-center gap-5 pt-8"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex -space-x-2.5">
                  {['teal', 'violet', 'coral', 'emerald', '#06b6d4'].map((c, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                      style={{ borderColor: '#030309', background: typeof c === 'string' && c.startsWith('#') ? c : `var(--${c})`, color: '#030309' }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" style={{ color: '#00d9ff' }} />
                    ))}
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                    Trusted by <span style={{ color: 'var(--text-1)' }}>12,000+</span> artists globally
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Right: Floating Artwork Grid ─────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.4,0,0.2,1] }}
              className="hidden lg:grid grid-cols-3 gap-3"
            >
              {HERO_IMGS.map((img, i) => (
                <motion.div
                  key={i}
                  className="relative overflow-hidden rounded-2xl group cursor-pointer"
                  style={{ height: `${i === 0 ? 220 : i === 2 ? 260 : i === 4 ? 240 : 180}px`, boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px ${img.accent}22` }}
                  animate={{ y: [0, i % 2 === 0 ? -10 : 8, 0] }}
                  transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                  {/* Tinted overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: `linear-gradient(to top, ${img.accent}cc 0%, transparent 60%)` }} />

                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `inset 0 0 0 1px ${img.accent}66` }} />

                  <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{img.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
            className="h-8 w-5 rounded-full border flex items-start justify-center pt-1.5"
            style={{ borderColor: 'rgba(0,217,255,0.3)' }}>
            <div className="h-1.5 w-1 rounded-full" style={{ background: 'var(--teal)' }} />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2 — STATS MARQUEE
      ═══════════════════════════════════════════════════ */}
      <section className="py-12 overflow-hidden" style={{ borderTop: '1px solid rgba(0,217,255,0.08)', borderBottom: '1px solid rgba(168,85,247,0.08)' }}>
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Artworks Uploaded', target: 14000, suffix: '+', color: '#00d9ff' },
              { label: 'Active Artists',    target: 5200,  suffix: '+', color: '#a855f7' },
              { label: 'Monthly Views',     target: 120,   suffix: 'k', prefix: '', color: '#ff4d6d' },
              { label: 'Sales This Month',  target: 860,   suffix: '+', color: '#10b981' },
            ].map((s, i) => (
              <motion.div key={i} {...rev(i * 0.07)} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold mb-1" style={{ color: s.color }}>
                  <Counter target={s.target} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-3)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3 — TRENDING ARTWORKS (masonry)
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <motion.div {...rev(0)}>
              <p className="label mb-4">Curated This Week</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-0)' }}>
                Trending<br /><span className="text-teal-glow">Right Now</span>
              </h2>
            </motion.div>
            <motion.div {...rev(0.1)}>
              <Link to="/explore" className="flex items-center gap-2 text-sm font-semibold transition-colors group"
                style={{ color: 'var(--teal)' }}>
                View All
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
          <hr className="rule mb-12" />

          {loading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="break-inside-avoid skeleton" style={{ height: `${200 + (i % 3) * 80}px` }} />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-sm" style={{ color: 'var(--text-3)' }}>No artworks yet — be the first!</p>
              <Link to="/register" className="btn-primary mt-6">Start Creating</Link>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {featured.map((art, i) => (
                <motion.div key={art._id} {...rev(i * 0.04)} className="break-inside-avoid">
                  <Link to={`/artwork/${art._id}`} className="group block overflow-hidden rounded-2xl relative"
                    style={{ background: 'rgba(14,14,32,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                    <img
                      src={art.images[0]}
                      alt={art.title}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ maxHeight: '440px', minHeight: '160px' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-between p-4"
                      style={{ background: 'linear-gradient(to top, rgba(3,3,9,0.97) 35%, rgba(3,3,9,0.25) 100%)' }}>
                      <div className="self-end">
                        {art.isForSale && (
                          <span className="badge-coral">${art.price}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-display text-base font-bold mb-2" style={{ color: 'var(--text-0)' }}>{art.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={art.artistProfile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${art.artist?.username}`}
                              className="h-5 w-5 rounded-full object-cover" alt="" />
                            <span className="text-[11px]" style={{ color: 'var(--text-2)' }}>
                              {art.artistProfile?.fullName || art.artist?.username}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-3)' }}>
                            <Eye className="h-3 w-3" /> {art.views}
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

      {/* ═══════════════════════════════════════════════════
          4 — CATEGORIES
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8 relative overflow-hidden">
        <div className="orb orb-violet w-[600px] h-[600px] absolute -right-40 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />

        <div className="mx-auto max-w-7xl relative">
          <motion.div {...rev(0)} className="text-center mb-14">
            <p className="label justify-center mb-4">Browse By Medium</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-0)' }}>
              Find Your<br /><span className="text-violet-glow">Aesthetic</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} {...rev(i * 0.05)}>
                <Link to={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="group relative block overflow-hidden rounded-2xl aspect-square"
                  style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" />
                  <div className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to top, rgba(3,3,9,0.9) 0%, rgba(3,3,9,0.3) 100%)` }} />

                  {/* Colored glow border on hover */}
                  <div className="absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${cat.color}66`, background: `linear-gradient(to top, ${cat.color}22 0%, transparent 60%)` }} />

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="h-0.5 rounded-full mb-2 transition-all duration-400 w-4 group-hover:w-full"
                      style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }} />
                    <p className="text-xs font-bold" style={{ color: 'var(--text-0)' }}>{cat.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5 — WHY ARTISTHUB (features)
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="mx-auto max-w-7xl">
          <motion.div {...rev(0)} className="text-center mb-16">
            <p className="label justify-center mb-4">The Platform</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-0)' }}>
              Built For<br /><span className="text-multi">Serious Artists</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} {...rev(i * 0.08)}>
                  <div className="h-full p-7 rounded-2xl transition-all duration-350 group cursor-default"
                    style={{ background: 'rgba(14,14,32,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '44'; e.currentTarget.style.boxShadow = `0 0 40px ${f.color}14, 0 16px 48px rgba(0,0,0,0.5)`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"
                      style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                      <Icon className="h-5.5 w-5.5" style={{ color: f.color }} />
                    </div>
                    <h4 className="font-accent text-base font-bold mb-3" style={{ color: 'var(--text-0)' }}>{f.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6 — TRENDING ARTISTS
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <motion.div {...rev(0)}>
              <p className="label mb-4">Rising Stars</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-0)' }}>
                Meet the<br /><span className="text-coral-glow">Creators</span>
              </h2>
            </motion.div>
          </div>
          <hr className="rule mb-12" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 skeleton" />)}
            </div>
          ) : artists.length === 0 ? (
            <p className="text-center py-12 text-sm" style={{ color: 'var(--text-3)' }}>No artists yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artists.slice(0, 6).map((artist, i) => (
                <motion.div key={artist._id} {...rev(i * 0.07)}>
                  <Link
                    to={`/artist/${artist.user?.username}`}
                    className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 group"
                    style={{ background: 'rgba(14,14,32,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,217,255,0.25)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,217,255,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={artist.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${artist.user?.username}`}
                        className="h-14 w-14 rounded-2xl object-cover" alt=""
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      />
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--teal)', boxShadow: '0 0 10px rgba(0,217,255,0.5)' }}>
                        <Star className="h-2.5 w-2.5" style={{ color: '#030309' }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-accent text-sm font-bold truncate mb-0.5" style={{ color: 'var(--text-0)' }}>{artist.fullName}</h4>
                      <p className="text-[11px] mb-2" style={{ color: 'var(--text-3)' }}>@{artist.user?.username}</p>
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-3)' }}>
                          <Users className="h-3 w-3" style={{ color: 'var(--teal)' }} /> {artist.followersCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-3)' }}>
                          <Eye className="h-3 w-3" style={{ color: 'var(--violet)' }} /> {artist.views || 0}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                      style={{ color: 'var(--teal)' }} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7 — TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-5 md:px-8 relative overflow-hidden">
        <div className="orb orb-teal w-[500px] h-[500px] absolute -left-40 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none" />

        <div className="mx-auto max-w-7xl relative">
          <motion.div {...rev(0)} className="text-center mb-14">
            <p className="label justify-center mb-4">Artist Stories</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-0)' }}>
              Artists <span className="text-teal-glow">Love</span> Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...rev(i * 0.08)}>
                <div className="h-full p-7 rounded-2xl flex flex-col gap-5 relative overflow-hidden"
                  style={{ background: 'rgba(14,14,32,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Accent corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10"
                    style={{ background: `radial-gradient(circle at top right, ${i===0?'#00d9ff':i===1?'#a855f7':'#ff4d6d'}, transparent 70%)` }} />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" style={{ color: '#00d9ff' }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 italic" style={{ color: 'var(--text-2)' }}>
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-xl object-cover"
                      style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-0)' }}>{t.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8 — FINAL CTA
      ═══════════════════════════════════════════════════ */}
      <section className="py-32 px-5 md:px-8 relative overflow-hidden">
        {/* Big glowing orbs for drama */}
        <div className="orb orb-teal   w-[600px] h-[600px] absolute -top-40 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none" />
        <div className="orb orb-coral  w-[400px] h-[400px] absolute bottom-0 right-0 opacity-15 pointer-events-none" />
        <div className="orb orb-violet w-[400px] h-[400px] absolute bottom-0 left-0  opacity-15 pointer-events-none" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(0,217,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div {...rev(0)} className="relative mx-auto max-w-3xl text-center">
          <p className="label justify-center mb-6">Your Journey Starts Now</p>
          <h2 className="font-display leading-[1.05] mb-6" style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', color: 'var(--text-0)' }}>
            Your Art Deserves<br />
            <span className="text-multi">The World's Stage.</span>
          </h2>
          <p className="text-base mb-12" style={{ color: 'var(--text-2)', maxWidth: '480px', margin: '0 auto 3rem' }}>
            Join thousands of artists who turned their passion into a thriving creative career — for free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-9 py-4">
              Create Free Portfolio <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/explore" className="btn-ghost text-base px-9 py-4">
              Browse Gallery
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Landing;
