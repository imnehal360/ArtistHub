import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, Check } from 'lucide-react';

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

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="page-content" style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="mx-auto max-w-screen-xl px-6 md:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-0">
              <span className="font-display text-xl leading-none tracking-widest" style={{ color: '#fff', letterSpacing: '0.12em' }}>
                ARTIST<span style={{ color: 'rgba(255,255,255,0.45)' }}>HUB</span>
              </span>
            </Link>
            <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '220px' }}>
              A premium monochrome portfolio platform designed for independent artists to showcase talent and connect with collectors worldwide.
            </p>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#ffffff' }}>
                {heading}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map(({ label, path }) => (
                  <li key={path}>
                    <Link to={path}
                      className="font-sans text-xs transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
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
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: '#ffffff' }}>
              Newsletter
            </p>
            <p className="font-sans text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Weekly drops: curated B&W galleries, rising creators, and exhibition notes.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-12 py-3 rounded-none text-xs outline-none transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff'
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              />
              <button type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff'
                }}
              >
                {subscribed ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-[10px]" style={{ color: '#ffffff' }}>Subscribed successfully. ✦</p>
            )}
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} ArtistHub. Brutalist Art Gallery Style.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#"
                className="font-mono text-[9px] uppercase tracking-wider transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
