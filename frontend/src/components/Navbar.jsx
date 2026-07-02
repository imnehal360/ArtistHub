import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import API from '../services/api.js';
import {
  Search, Bell, Mail, Upload, Menu, X,
  LogOut, LayoutDashboard, User, Settings,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isArtist, isAdmin } = useAuth();
  const { isDark } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [suggestions,   setSuggestions]   = useState([]);
  const [suggestOpen,   setSuggestOpen]   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);

  const searchRef  = useRef(null);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  { setSuggestOpen(false); setSearchOpen(false); }
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try { const r = await API.get(`/artworks/suggestions?q=${searchQuery}`); setSuggestions(r.data); } catch {}
    }, 280);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fn = async () => {
      try { const r = await API.get('/notifications'); setNotifications(r.data); setUnreadCount(r.data.filter(n=>!n.isRead).length); } catch {}
    };
    fn();
    const id = setInterval(fn, 20000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  const markRead = async () => {
    try { await API.put('/notifications/read'); setUnreadCount(0); } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/explore?search=${searchQuery}`); setSuggestOpen(false); setSearchOpen(false); }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: 'Gallery',  path: '/explore' },
    { label: 'Artists',  path: '/explore?sortBy=trending' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto max-w-screen-xl px-6 md:px-10">
        <div className="flex h-16 items-center justify-between">

          {/* ── LOGO ─────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-0 shrink-0">
            <span className="font-display text-2xl leading-none tracking-widest" style={{ color: '#fff', fontSize: '1.5rem', letterSpacing: '0.12em' }}>
              ARTIST<span style={{ color: 'rgba(255,255,255,0.45)' }}>HUB</span>
            </span>
          </Link>

          {/* ── CENTER NAV (desktop) ─────────────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link
                key={l.path}
                to={l.path}
                className="font-sans text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200"
                style={{ color: isActive(l.path) ? '#fff' : 'rgba(255,255,255,0.45)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => { if (!isActive(l.path)) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── RIGHT CONTROLS ───────────────────────────── */}
          <div className="flex items-center gap-4">

            {/* Search toggle */}
            <div ref={searchRef} className="relative">
              <button onClick={() => setSearchOpen(!searchOpen)} className="btn-icon">
                {searchOpen ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: '260px' }} exit={{ opacity: 0, width: 0 }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 overflow-hidden"
                    style={{ transformOrigin: 'right' }}
                  >
                    <form onSubmit={handleSearch}>
                      <input
                        autoFocus
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setSuggestOpen(true); }}
                        placeholder="Search works, artists…"
                        className="w-full input-field py-2 text-xs"
                        style={{ borderRadius: 0 }}
                      />
                    </form>
                    <AnimatePresence>
                      {suggestOpen && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute top-full left-0 right-0 z-50"
                          style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none' }}
                        >
                          {suggestions.map((s, i) => (
                            <button key={i}
                              onClick={() => { navigate(s.type === 'artist' ? `/artist/${s.username}` : `/artwork/${s.id}`); setSuggestOpen(false); setSearchOpen(false); setSearchQuery(''); }}
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors"
                              style={{ color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                            >
                              <span>{s.text}</span>
                              <span className="section-tag ml-2">{s.type}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div ref={notifRef} className="relative">
                  <button className="btn-icon relative"
                    onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unreadCount > 0) markRead(); }}>
                    <Bell className="h-3.5 w-3.5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 flex items-center justify-center text-[8px] font-bold"
                        style={{ background: '#fff', color: '#000', borderRadius: '50%' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-11 w-72 z-50"
                        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <p className="overline">Notifications</p>
                          {unreadCount > 0 && <span className="section-tag">{unreadCount} new</span>}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center section-tag">All caught up</p>
                          ) : notifications.map((n, i) => (
                            <div key={n._id || i} className="flex gap-3 px-4 py-3"
                              style={{ background: n.isRead ? 'transparent' : 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <img src={n.senderProfile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${n.sender?.username}`}
                                className="h-7 w-7 object-cover shrink-0 bw" style={{ borderRadius: '50%' }} alt="" />
                              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                <span style={{ color: '#fff' }}>@{n.sender?.username}</span>{' '}
                                {n.type === 'like' && 'liked your artwork'}
                                {n.type === 'comment' && 'commented on your work'}
                                {n.type === 'follow' && 'started following you'}
                                {n.type === 'message' && 'sent you a message'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Upload */}
                {isArtist && (
                  <Link to="/dashboard/upload" className="hidden md:block btn-sm">
                    <Upload className="h-3 w-3" /> Upload
                  </Link>
                )}

                {/* Profile */}
                <div ref={profileRef} className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-70">
                    <img src={user.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                      className="h-7 w-7 object-cover bw" style={{ borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} alt="" />
                    <span className="hidden md:block font-sans text-xs font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.7)' }}>{user.username}</span>
                    <ChevronDown className="hidden md:block h-3 w-3" style={{ color: 'rgba(255,255,255,0.4)', transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-11 w-48 z-50"
                        style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <p className="text-xs font-semibold" style={{ color: '#fff' }}>@{user.username}</p>
                          <p className="section-tag mt-0.5 capitalize">{user.role}</p>
                        </div>
                        {[
                          isArtist && { icon: User,          label: 'My Portfolio',  to: `/artist/${user.username}` },
                          (isArtist || isAdmin) && { icon: LayoutDashboard, label: isAdmin ? 'Admin' : 'Dashboard', to: isAdmin ? '/admin' : '/dashboard' },
                          { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
                        ].filter(Boolean).map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <Link key={i} to={item.to} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors"
                              style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                            >
                              <Icon className="h-3 w-3" />{item.label}
                            </Link>
                          );
                        })}
                        <button onClick={() => { logout(); setProfileOpen(false); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors"
                          style={{ color: 'rgba(255,255,255,0.35)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                        >
                          <LogOut className="h-3 w-3" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login"
                  className="font-sans text-xs font-semibold tracking-[0.15em] uppercase transition-colors"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                >Login</Link>
                <Link to="/register" className="btn-sm">Join</Link>
              </div>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden btn-icon">
              {mobileOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="px-6 py-5 flex flex-col gap-3">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                  className="font-sans text-xs font-semibold tracking-[0.2em] uppercase py-2"
                  style={{ color: isActive(l.path) ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
