import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import API from '../services/api.js';
import {
  Search, Bell, Mail, Sun, Moon, Upload, Menu, X,
  LogOut, LayoutDashboard, User, Settings, Palette,
  ChevronDown, Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isArtist, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen]             = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');
  const [suggestions, setSuggestions]           = useState([]);
  const [suggestOpen, setSuggestOpen]           = useState(false);
  const [notifications, setNotifications]       = useState([]);
  const [notifOpen, setNotifOpen]               = useState(false);
  const [unreadCount, setUnreadCount]           = useState(0);
  const [profileOpen, setProfileOpen]           = useState(false);
  const [scrolled, setScrolled]                 = useState(false);

  const searchRef  = useRef(null);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  /* ── scroll shadow ───────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── outside click ───────────────────────────────────────── */
  useEffect(() => {
    const handle = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSuggestOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* ── search debounce ─────────────────────────────────────── */
  useEffect(() => {
    if (searchQuery.trim().length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await API.get(`/artworks/suggestions?q=${searchQuery}`);
        setSuggestions(res.data);
      } catch {}
    }, 280);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* ── notifications poll ──────────────────────────────────── */
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetch = async () => {
      try {
        const res = await API.get('/notifications');
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      } catch {}
    };
    fetch();
    const id = setInterval(fetch, 20000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  const markRead = async () => {
    try { await API.put('/notifications/read'); setUnreadCount(0); } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/explore?search=${searchQuery}`); setSuggestOpen(false); }
  };

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Artists', path: '/explore?sortBy=trending' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '?');

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(7,7,13,0.85)'
          : 'rgba(7,7,13,0.4)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* ── LOGO ─────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 2px 16px rgba(245,158,11,0.3)' }}>
              <Palette className="h-4.5 w-4.5 text-obsidian-950" style={{ color: '#07070d' }} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-cream">
              Artist<span style={{ color: '#f59e0b' }}>Hub</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV LINKS ─────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link
                key={l.path}
                to={l.path}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{ color: isActive(l.path) ? '#f59e0b' : '#9d9dab' }}
                onMouseEnter={e => { if (!isActive(l.path)) e.currentTarget.style.color = '#f5f0e8'; }}
                onMouseLeave={e => { if (!isActive(l.path)) e.currentTarget.style.color = '#9d9dab'; }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── SEARCH (desktop) ─────────────────────────────── */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-xs">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#5a5a70' }} />
                <input
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSuggestOpen(true); }}
                  onFocus={e => { setSuggestOpen(true); e.target.style.borderColor = 'rgba(245,158,11,0.4)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  placeholder="Search artworks, artists…"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#f5f0e8',
                  }}
                />
              </div>
            </form>

            <AnimatePresence>
              {suggestOpen && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute top-10 left-0 right-0 z-50 overflow-hidden rounded-xl"
                  style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { navigate(s.type === 'artist' ? `/artist/${s.username}` : `/artwork/${s.id}`); setSuggestOpen(false); setSearchQuery(''); }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors"
                      style={{ color: '#9d9dab' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; e.currentTarget.style.color = '#f5f0e8'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9d9dab'; }}
                    >
                      <span className="font-medium" style={{ color: '#f5f0e8' }}>{s.text}</span>
                      <span className="capitalize px-2 py-0.5 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.06)' }}>{s.type}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT CONTROLS ───────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors" title="Toggle theme"
              style={{ color: '#5a5a70' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
              onMouseLeave={e => e.currentTarget.style.color = '#5a5a70'}
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Messages */}
                <Link to="/dashboard/messages" className="p-2 rounded-lg" title="Messages"
                  style={{ color: '#5a5a70' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f5f0e8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5a5a70'}
                >
                  <Mail className="h-4.5 w-4.5" />
                </Link>

                {/* Notifications */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unreadCount > 0) markRead(); }}
                    className="relative p-2 rounded-lg transition-colors"
                    style={{ color: unreadCount > 0 ? '#f59e0b' : '#5a5a70' }}
                  >
                    <Bell className="h-4.5 w-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full text-[9px] font-bold"
                        style={{ background: '#f59e0b', color: '#07070d' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 top-11 w-80 rounded-2xl overflow-hidden z-50"
                        style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}
                      >
                        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <h4 className="font-display text-sm font-semibold" style={{ color: '#f5f0e8' }}>Notifications</h4>
                          {notifications.length > 0 && (
                            <span className="text-[10px] font-medium" style={{ color: '#f59e0b' }}>{notifications.filter(n=>!n.isRead).length} new</span>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-xs" style={{ color: '#5a5a70' }}>No notifications yet</p>
                          ) : notifications.map((n, i) => (
                            <div key={n._id || i} className="flex gap-3 px-4 py-3 transition-colors"
                              style={{ background: n.isRead ? 'transparent' : 'rgba(245,158,11,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            >
                              <img src={n.senderProfile?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + n.sender?.username}
                                className="h-8 w-8 rounded-full object-cover shrink-0" alt="" />
                              <div className="min-w-0">
                                <p className="text-xs leading-relaxed" style={{ color: '#9d9dab' }}>
                                  <span className="font-semibold" style={{ color: '#f5f0e8' }}>@{n.sender?.username}</span>{' '}
                                  {n.type === 'like' && 'liked your artwork'}
                                  {n.type === 'comment' && 'commented on your work'}
                                  {n.type === 'follow' && 'started following you'}
                                  {n.type === 'message' && 'sent you a message'}
                                </p>
                                {n.artwork && <p className="text-[10px] mt-0.5 truncate" style={{ color: '#f59e0b' }}>{n.artwork.title}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Upload CTA */}
                {isArtist && (
                  <Link to="/dashboard/upload" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#07070d', boxShadow: '0 4px 16px rgba(245,158,11,0.25)' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(245,158,11,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.25)'}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </Link>
                )}

                {/* Profile dropdown */}
                <div ref={profileRef} className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    <img
                      src={user.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                      className="h-7 w-7 rounded-full object-cover" alt="Avatar" />
                    <span className="hidden md:block text-xs font-medium" style={{ color: '#f5f0e8' }}>{user.username}</span>
                    <ChevronDown className="hidden md:block h-3.5 w-3.5 transition-transform duration-200"
                      style={{ color: '#5a5a70', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 top-11 w-52 rounded-2xl overflow-hidden z-50"
                        style={{ background: '#1a1a26', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}
                      >
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          <p className="text-xs font-semibold" style={{ color: '#f5f0e8' }}>@{user.username}</p>
                          <p className="text-[10px] capitalize mt-0.5" style={{ color: '#5a5a70' }}>{user.role}</p>
                        </div>

                        {[
                          isArtist && { icon: User, label: 'Public Profile', to: `/artist/${user.username}` },
                          (isArtist || isAdmin) && { icon: LayoutDashboard, label: isAdmin ? 'Admin Panel' : 'Dashboard', to: isAdmin ? '/admin' : '/dashboard' },
                          { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
                        ].filter(Boolean).map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <Link key={i} to={item.to} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-xs transition-colors"
                              style={{ color: '#9d9dab' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; e.currentTarget.style.color = '#f5f0e8'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9d9dab'; }}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {item.label}
                            </Link>
                          );
                        })}

                        <button onClick={() => { logout(); setProfileOpen(false); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs transition-colors"
                          style={{ color: '#f43f5e', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut className="h-3.5 w-3.5" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
                  style={{ color: '#9d9dab' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f5f0e8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9d9dab'}
                >Sign In</Link>
                <Link to="/register" className="px-4 py-2 text-xs font-semibold rounded-lg transition-all"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#07070d', boxShadow: '0 2px 12px rgba(245,158,11,0.25)' }}
                >Get Started</Link>
              </div>
            )}

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg md:hidden"
              style={{ color: '#9d9dab' }}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(7,7,13,0.95)' }}
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: isActive(l.path) ? '#f59e0b' : '#9d9dab' }}>
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
