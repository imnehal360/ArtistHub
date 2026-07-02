import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import API from '../services/api.js';

/* ── helpers ─────────────────────────────────────────────── */
const Counter = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = Math.ceil(target / 80);
    const t = setInterval(() => { n += step; if (n >= target) { setVal(target); clearInterval(t); } else setVal(n); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.75, delay, ease: [0.4, 0, 0.2, 1] },
});

/* ── B&W reference images ────────────────────────────────── */
const HERO_IMG   = 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80&fit=crop';
const FEATURE_IMGS = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
  'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&q=80',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
];

const CATEGORIES = [
  { name: 'Digital Art',  img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=80' },
  { name: 'Illustration', img: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=700&q=80' },
  { name: 'Photography',  img: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=700&q=80' },
  { name: 'Painting',     img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700&q=80' },
];

const STATS = [
  { target: 14000, suffix: '+', label: 'Works Uploaded' },
  { target: 5200,  suffix: '+', label: 'Active Artists' },
  { target: 120,   suffix: 'K', label: 'Monthly Visitors' },
  { target: 860,   suffix: '+', label: 'Sales / Month' },
];

const TESTIMONIALS = [
  { name: 'Elena M.',   role: 'Concept Artist',     quote: 'The most refined portfolio platform I have ever used. My client work tripled in one month.' },
  { name: 'Kwame A.',   role: 'Freelance Illustrator', quote: 'Sold five prints in my first week. Elegant, fast, and built for serious creatives.' },
  { name: 'Yuki T.',    role: 'Watercolor Painter',  quote: 'Nothing comes close to the editorial quality of ArtistHub. It feels like a gallery, not a website.' },
];

/* ── COMPONENT ────────────────────────────────────────────── */
const Landing = () => {
  const [featured, setFeatured] = useState([]);
  const [artists,  setArtists]  = useState([]);
  const [loading,  setLoading]  = useState(true);

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
    <div className="page-root">

      {/* ══════════════════════════════════════════════════
          1 — HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">

        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Hero" className="w-full h-full object-cover bw" style={{ opacity: 0.55 }} />
          {/* Gradient fade to black at bottom */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 75%, #000 100%)' }} />
        </div>

        {/* Scrolling ticker at top */}
        <div className="absolute top-16 left-0 right-0 overflow-hidden z-10 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="marquee-track" style={{ gap: '4rem' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="section-tag whitespace-nowrap">
                ArtistHub &nbsp;·&nbsp; Portfolio &nbsp;·&nbsp; Gallery &nbsp;·&nbsp; Showcase &nbsp;·&nbsp; Collect &nbsp;·&nbsp; Create &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 md:px-10 pb-20 w-full">
          <div className="max-w-4xl">

            <motion.p {...up(0)} className="overline mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Welcome — Art Gallery Platform
            </motion.p>

            <motion.h1 {...up(0.07)}
              className="font-display mb-8"
              style={{ fontSize: 'clamp(5rem, 14vw, 13rem)', lineHeight: '0.9', letterSpacing: '-0.01em', color: '#fff' }}
            >
              ART<br />GALLERY
            </motion.h1>

            <motion.div {...up(0.14)} className="flex flex-wrap items-center gap-4">
              <Link to="/explore" className="btn">
                Let's Go &nbsp;→
              </Link>
              <Link to="/register"
                className="font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-colors"
                style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
              >
                Join Free
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom meta bar */}
        <div className="relative z-10 w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="mx-auto max-w-screen-xl px-6 md:px-10 py-4 flex items-center justify-between">
            <p className="section-tag">© {new Date().getFullYear()} ArtistHub</p>
            <div className="flex gap-8">
              {STATS.slice(0,2).map((s, i) => (
                <div key={i} className="text-right">
                  <p className="font-display text-xl leading-none text-white"><Counter target={s.target} suffix={s.suffix} /></p>
                  <p className="section-tag mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2 — ABOUT / INTRO STRIP
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-10 mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          <motion.div {...up(0)}>
            <p className="overline mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>About the Platform</p>
            <h2 className="font-display mb-8 text-white" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
              YOUR<br />WORK.<br />THE WORLD.
            </h2>
            <Link to="/register" className="btn-sm">
              Start Portfolio
            </Link>
          </motion.div>

          <motion.div {...up(0.1)}>
            <p className="body-text mb-6 text-base leading-loose" style={{ color: 'rgba(255,255,255,0.5)' }}>
              ArtistHub is a premium portfolio platform built for independent artists. Upload your work, curate a beautiful gallery, grow your following, and sell directly to collectors worldwide — no commissions, no gatekeepers.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {STATS.map((s, i) => (
                <div key={i}>
                  <p className="font-display text-4xl text-white mb-1"><Counter target={s.target} suffix={s.suffix} /></p>
                  <p className="section-tag">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <hr className="rule mx-6 md:mx-10" />

      {/* ══════════════════════════════════════════════════
          3 — TRENDING ARTWORKS (masonry)
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-10 mx-auto max-w-screen-xl">

        <div className="flex items-baseline justify-between mb-12">
          <motion.div {...up(0)}>
            <p className="overline mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Curated Selection</p>
            <h2 className="font-display text-white" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
              GALLERY
            </h2>
          </motion.div>
          <Link to="/explore"
            className="hidden md:flex items-center gap-2 font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            View All <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid skeleton" style={{ height: `${200 + (i % 3) * 80}px` }} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="py-24 text-center" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="section-tag">No artworks yet</p>
            <Link to="/register" className="btn mt-6">Start Creating</Link>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {featured.map((art, i) => (
              <motion.div key={art._id} {...up(i * 0.04)} className="break-inside-avoid">
                <Link to={`/artwork/${art._id}`}
                  className="group block relative overflow-hidden frame"
                  style={{ display: 'block' }}>
                  <img
                    src={art.images[0]}
                    alt={art.title}
                    className="w-full object-cover bw transition-all duration-700 group-hover:opacity-100"
                    style={{ maxHeight: '440px', minHeight: '160px' }}
                    loading="lazy"
                  />
                  {/* Hover info overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(0,0,0,0.82)' }}>
                    <div className="flex justify-end">
                      {art.isForSale && (
                        <span className="badge">${art.price} · For Sale</span>
                      )}
                    </div>
                    <div>
                      <p className="font-display text-xl text-white mb-2">{art.title.toUpperCase()}</p>
                      <div className="flex items-center gap-2">
                        <img src={art.artistProfile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${art.artist?.username}`}
                          className="h-5 w-5 object-cover bw" style={{ borderRadius: '50%' }} alt="" />
                        <span className="section-tag">{art.artistProfile?.fullName || art.artist?.username}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <hr className="rule mx-6 md:mx-10" />

      {/* ══════════════════════════════════════════════════
          4 — CATEGORIES
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-10 mx-auto max-w-screen-xl">
        <motion.div {...up(0)} className="mb-12">
          <p className="overline mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Browse by Medium</p>
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            VIRTUAL<br />EXHIBITION
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.name} {...up(i * 0.07)}>
              <Link to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group relative block overflow-hidden frame"
                style={{ aspectRatio: '3/4' }}>
                <img src={cat.img} alt={cat.name}
                  className="w-full h-full object-cover bw transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col justify-end p-5"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 30%, transparent 100%)' }}>
                  <p className="font-display text-2xl text-white">{cat.name.toUpperCase()}</p>
                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="section-tag">Explore</span>
                    <ArrowUpRight className="h-3 w-3" style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <hr className="rule mx-6 md:mx-10" />

      {/* ══════════════════════════════════════════════════
          5 — OUR TEAM (trending artists)
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-10 mx-auto max-w-screen-xl">
        <motion.div {...up(0)} className="mb-12">
          <p className="overline mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Featured Creators</p>
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            OUR TEAM
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-square skeleton" />)}
          </div>
        ) : artists.length === 0 ? (
          <p className="section-tag py-12">No artists yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {artists.slice(0, 6).map((artist, i) => (
              <motion.div key={artist._id} {...up(i * 0.07)}>
                <Link to={`/artist/${artist.user?.username}`} className="group flex flex-col items-center gap-3 text-center">
                  <div className="relative overflow-hidden frame" style={{ width: '100%', aspectRatio: '1' }}>
                    <img
                      src={artist.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${artist.user?.username}`}
                      alt={artist.fullName}
                      className="w-full h-full object-cover bw transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="font-sans text-xs font-semibold text-white group-hover:underline">{artist.fullName}</p>
                    <p className="section-tag mt-0.5">@{artist.user?.username}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <hr className="rule mx-6 md:mx-10" />

      {/* ══════════════════════════════════════════════════
          6 — CONTACT / CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-10 mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div {...up(0)}>
            <p className="overline mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Ready to Begin?</p>
            <h2 className="font-display text-white" style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>
              YOUR<br />ART<br />DESERVES<br />A STAGE.
            </h2>
          </motion.div>

          <motion.div {...up(0.1)} className="flex flex-col gap-6">
            <p className="body-text text-base leading-loose" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '380px' }}>
              Join thousands of independent artists who turned their passion into a career. Free forever — no commissions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn">
                Create Portfolio &nbsp;→
              </Link>
              <Link to="/explore" className="btn-sm">
                Browse Gallery
              </Link>
            </div>
            <div className="flex gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {TESTIMONIALS.slice(0,2).map((t, i) => (
                <div key={i}>
                  <p className="font-sans text-[11px] italic mb-2" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '200px' }}>
                    "{t.quote.substring(0, 70)}…"
                  </p>
                  <p className="section-tag">{t.name} · {t.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
