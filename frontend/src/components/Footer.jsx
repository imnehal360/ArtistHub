import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Mail, Send, Check, Twitter, Instagram, Dribbble, Github } from 'lucide-react';

const LINKS = {
  Discover: [
    { label: 'Explore Gallery',  path: '/explore' },
    { label: 'Trending Works',   path: '/explore?sortBy=trending' },
    { label: 'Shop Artworks',    path: '/explore?isForSale=true' },
    { label: 'Digital Art',      path: '/explore?category=Digital%20Art' },
    { label: 'Photography',      path: '/explore?category=Photography' },
  ],
  Platform: [
    { label: 'Sign In',           path: '/login' },
    { label: 'Get Started Free',  path: '/register' },
    { label: 'For Artists',       path: '/register' },
    { label: 'For Collectors',    path: '/explore' },
  ],
};

const SOCIALS = [
  { icon: Twitter,   href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Dribbble,  href: '#', label: 'Dribbble' },
  { icon: Github,    href: '#', label: 'GitHub' },
];

const Footer = () => {
  const [email,      setEmail]      = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="page-content" style={{ background: 'rgba(3,3,9,1)', borderTop: '1px solid rgba(0,217,255,0.08)' }}>

      {/* Top accent */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,217,255,0.3) 30%, rgba(168,85,247,0.3) 70%, transparent)' }} />

      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg,#00d9ff,#06b6d4)', boxShadow: '0 0 20px rgba(0,217,255,0.3)' }}>
                <Palette className="h-5 w-5" style={{ color: '#030309' }} />
              </div>
              <span className="font-display text-lg font-bold" style={{ color: '#f0f0ff' }}>
                Artist<span style={{ color: '#00d9ff', textShadow: '0 0 12px rgba(0,217,255,0.4)' }}>Hub</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)', maxWidth: '220px' }}>
              A premium portfolio platform for independent artists to showcase their talent, grow their audience, and sell their work worldwide.
            </p>

            {/* Socials */}
            <div className="flex gap-2.5 mt-1">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                  className="h-8 w-8 flex items-center justify-center rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-3)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,217,255,0.4)'; e.currentTarget.style.color = '#00d9ff'; e.currentTarget.style.background = 'rgba(0,217,255,0.06)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(0,217,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#00d9ff' }}>
                {heading}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map(({ label, path }) => (
                  <li key={path}>
                    <Link to={path}
                      className="text-xs transition-colors duration-200"
                      style={{ color: 'var(--text-3)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#a855f7' }}>
              Newsletter
            </p>
            <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--text-3)' }}>
              Weekly drops: curated galleries, rising stars & collector insights.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: 'var(--text-3)' }} />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-12 py-3 rounded-xl text-xs outline-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-1)' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,217,255,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,217,255,0.05)'; }}
                onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg transition-all duration-200"
                style={{
                  background: subscribed ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg,#00d9ff,#06b6d4)',
                  color: subscribed ? '#10b981' : '#030309',
                  boxShadow: subscribed ? 'none' : '0 2px 12px rgba(0,217,255,0.3)',
                }}>
                {subscribed ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-[10px]" style={{ color: '#10b981' }}>You're in! ✦ First drop coming soon.</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>
            © {new Date().getFullYear()} ArtistHub. Crafted for artists, by artists. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#"
                className="text-[10px] transition-colors"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-2)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
