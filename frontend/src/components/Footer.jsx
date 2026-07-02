import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Send, Check } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="mt-20 border-t border-slate-100 bg-slate-50/50 py-16 dark:border-slate-800 dark:bg-brand-950/20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Column 1 - Brand info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              <Sparkles className="h-5 w-5 text-brand-500" />
              <span>Artist<span className="text-brand-500">Hub</span></span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              A premium, startup-grade portfolio platform designed specifically for independent artists to showcase their talent, build communities, and sell artwork.
            </p>
          </div>

          {/* Column 2 - Categories */}
          <div>
            <h4 className="font-display text-sm font-semibold text-slate-800 dark:text-slate-200">Categories</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/explore?category=Digital%20Art" className="hover:text-brand-500">Digital Art</Link></li>
              <li><Link to="/explore?category=Painting" className="hover:text-brand-500">Painting</Link></li>
              <li><Link to="/explore?category=Sketch" className="hover:text-brand-500">Sketch</Link></li>
              <li><Link to="/explore?category=Photography" className="hover:text-brand-500">Photography</Link></li>
            </ul>
          </div>

          {/* Column 3 - Explore */}
          <div>
            <h4 className="font-display text-sm font-semibold text-slate-800 dark:text-slate-200">Platform</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link to="/explore" className="hover:text-brand-500">Explore Gallery</Link></li>
              <li><Link to="/explore?sortBy=trending" className="hover:text-brand-500">Trending Artworks</Link></li>
              <li><Link to="/explore?isForSale=true" className="hover:text-brand-500">Shop Artworks</Link></li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h4 className="font-display text-sm font-semibold text-slate-800 dark:text-slate-200">Newsletter</h4>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Get notified of weekly featured artists and trending galleries.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-4 flex">
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full bg-slate-100 py-2.5 pl-10 pr-12 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-slate-900 dark:text-slate-100"
                required
              />
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600 transition-all"
              >
                {subscribed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-[10px] text-green-500">Subscribed successfully!</p>
            )}
          </div>

        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 text-center text-[10px] text-slate-400 dark:border-slate-800">
          <p>© {new Date().getFullYear()} ArtistHub. Built for designers and creatives globally. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
