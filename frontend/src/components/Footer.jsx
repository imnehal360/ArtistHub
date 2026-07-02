import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Mail, Send, Check, Twitter, Instagram, Dribbble } from 'lucide-react';

const LINKS = {
  Categories: [
    { label: 'Digital Art',   path: '/explore?category=Digital%20Art' },
    { label: 'Painting',      path: '/explore?category=Painting' },
    { label: 'Photography',   path: '/explore?category=Photography' },
    { label: 'Illustration',  path: '/explore?category=Illustration' },
    { label: 'Watercolor',    path: '/explore?category=Watercolor' },
  ],
  Platform: [
    { label: 'Explore Gallery',  path: '/explore' },
    { label: 'Trending Works',   path: '/explore?sortBy=trending' },
    { label: 'Shop Artworks',    path: '/explore?isForSale=true' },
    { label: 'Sign In',          path: '/login' },
    { label: 'Get Started',      path: '/register' },
  ],
};

const SOCIALS = [
  { icon: Twitter,   href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Dribbble,  href: '#', label: 'Dribbble' },
];

const Footer = () => {
  const [email, setEmail]           = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: '#07070d', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 2px 16px rgba(245,158,11,0.25)' }}>
                <Palette className="h-4.5 w-4.5" style={{ color: '#07070d' }} />
              </div>
              <span className="font-display text-lg font-bold" style={{ color: '#f5f0e8' }}>
                Artist<span style={{ color: '#f59e0b' }}>Hub</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: '#5a5a70', maxWidth: '220px' }}>
              A premium portfolio platform for independent artists to showcase their talent, grow their audience, and sell their work.
            </p>

            {/* Socials */}
            <div className="flex gap-3 mt-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#5a5a70' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#5a5a70'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: '#f59e0b' }}>
                {heading}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map(({ label, path }) => (
                  <li key={path}>
                    <Link to={path} className="text-xs transition-colors duration-200"
                      style={{ color: '#5a5a70' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f5f0e8'}
                      onMouseLeave={e => e.currentTarget.style.color = '#5a5a70'}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: '#f59e0b' }}>
              Newsletter
            </p>
            <p className="text-xs leading-relaxed mb-5" style={{ color: '#5a5a70' }}>
              Weekly drops: curated galleries, rising stars, and collector insights.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#5a5a70' }} />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-12 py-3 rounded-xl text-xs outline-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#f5f0e8' }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.4)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-200"
                style={{ background: subscribed ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: subscribed ? '#10b981' : '#07070d' }}>
                {subscribed ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-[10px]" style={{ color: '#10b981' }}>You're subscribed! ✦</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-[10px]" style={{ color: '#333342' }}>
            © {new Date().getFullYear()} ArtistHub. Crafted for artists, by artists.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" className="text-[10px] transition-colors"
                style={{ color: '#333342' }}
                onMouseEnter={e => e.currentTarget.style.color = '#5a5a70'}
                onMouseLeave={e => e.currentTarget.style.color = '#333342'}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
