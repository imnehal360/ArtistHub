import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import API from '../services/api.js';
import {
  Search, Bell, Mail, Sun, Moon, Upload, Menu, X,
  LogOut, LayoutDashboard, User, Settings, Palette,
  ChevronDown, Sparkles, Zap
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isArtist, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
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

  const searchRef  = useRef(null);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSuggestOpen(false);
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
    const fetch = async () => {
      try { const r = await API.get('/notifications'); setNotifications(r.data); setUnreadCount(r.data.filter(n=>!n.isRead).length); } catch {}
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

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path.split('?')[0]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        background: scrolled
          ? 'rgba(3,3,9,0.88)'
          : 'rgba(3,3,9,0.35)',
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        borderBottom: scrolled
          ? '1px solid rgba(0,217,255,0.1)'
          : '1px solid rgba(255,255,255,0.04)',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.6), 0 0 60px rgba(0,217,255,0.04)' : 'none',
      }}
    >
      {/* Teal top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,217,255,0.5) 30%, rgba(168,85,247,0.5) 70%, transparent 100%)' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* ── LOGO ───────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #00d9ff 0%, #06b6d4 100%)', boxShadow: '0 0 20px rgba(0,217,255,0.35)' }}>
              <Palette className="h-4 w-4" style={{ color: '#030309' }} />
            </div>
            <span className="font-display text-lg font-bold tracking-tight" style={{ color: '#f0f0ff' }}>
              Artist<span style={{ color: '#00d9ff', textShadow: '0 0 16px rgba(0,217,255,0.5)' }}>Hub</span>
            </span>
          </Link>

          {/* ── NAV LINKS ──────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link
                key={l.path}
                to={l.path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{ color: isActive(l.path) ? '#00d9ff' : 'var(--text-2)' }}
                onMouseEnter={e => { if (!isActive(l.path)) e.currentTarget.style.color = 'var(--text-0)'; }}
                onMouseLeave={e => { if (!isActive(l.path)) e.currentTarget.style.color = 'var(--text-2)'; }}
              >
                {l.label}
                {isActive(l.path) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full"
                    style={{ background: '#00d9ff', boxShadow: '0 0 8px rgba(0,217,255,0.8)' }} />
                )}
              </Link>
            ))}
          </nav>

          {/* ── SEARCH ─────────────────────────────────── */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-xs">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
                  style={{ color: 'var(--text-3)' }} />
                <input
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSuggestOpen(true); }}
                  onFocus={e => {
                    setSuggestOpen(true);
                    e.target.style.borderColor = 'rgba(0,217,255,0.4)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,217,255,0.06)';
                    e.target.style.background = 'rgba(0,217,255,0.04)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  placeholder="Search artworks, artists…"
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl outline-none transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-1)' }}
                />
              </div>
            </form>

            <AnimatePresence>
              {suggestOpen && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute top-10 left-0 right-0 z-50 overflow-hidden rounded-xl"
                  style={{ background: 'rgba(8,8,20,0.96)', border: '1px solid rgba(0,217,255,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 16px 48px rgba(0,0,0,0.8), 0 0 40px rgba(0,217,255,0.08)' }}
                >
                  {suggestions.map((s, i) => (
                    <button key={i}
                      onClick={() => { navigate(s.type === 'artist' ? `/artist/${s.username}` : `/artwork/${s.id}`); setSuggestOpen(false); setSearchQuery(''); }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors"
                      style={{ color: 'var(--text-2)', borderBottom: i < suggestions.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,255,0.06)'; e.currentTarget.style.color = '#00d9ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}
                    >
                      <span style={{ color: 'var(--text-0)' }}>{s.text}</span>
                      <span className="badge">{s.type}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT CONTROLS ─────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            <button onClick={toggleTheme} title="Toggle theme"
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#00d9ff'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard/messages" title="Messages"
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-3)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                  <Mail className="h-4 w-4" />
                </Link>

                {/* Notifications */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unreadCount > 0) markRead(); }}
                    className="relative p-2 rounded-lg transition-colors"
                    style={{ color: unreadCount > 0 ? '#00d9ff' : 'var(--text-3)' }}
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full text-[9px] font-bold"
                        style={{ background: '#ff4d6d', color: '#fff', boxShadow: '0 0 10px rgba(255,77,109,0.5)' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 top-11 w-80 rounded-2xl overflow-hidden z-50"
                        style={{ background: 'rgba(8,8,20,0.97)', border: '1px solid rgba(0,217,255,0.15)', backdropFilter: 'blur(24px)', boxShadow: '0 24px 64px rgba(0,0,0,0.9), 0 0 40px rgba(0,217,255,0.07)' }}
                      >
                        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <h4 className="font-accent text-sm font-bold" style={{ color: 'var(--text-0)' }}>Notifications</h4>
                          {notifications.length > 0 && (
                            <span className="text-[10px] font-bold" style={{ color: '#00d9ff' }}>{unreadCount} new</span>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-xs" style={{ color: 'var(--text-3)' }}>You're all caught up ✦</p>
                          ) : notifications.map((n, i) => (
                            <div key={n._id || i} className="flex gap-3 px-4 py-3 transition-colors"
                              style={{ background: n.isRead ? 'transparent' : 'rgba(0,217,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <img src={n.senderProfile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${n.sender?.username}`}
                                className="h-8 w-8 rounded-full object-cover shrink-0" alt="" style={{ background: 'rgba(255,255,255,0.06)' }} />
                              <div className="min-w-0">
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                                  <span className="font-semibold" style={{ color: 'var(--text-0)' }}>@{n.sender?.username}</span>{' '}
                                  {n.type === 'like' && 'liked your artwork'}
                                  {n.type === 'comment' && 'commented on your work'}
                                  {n.type === 'follow' && 'started following you'}
                                  {n.type === 'message' && 'sent you a message'}
                                </p>
                                {n.artwork && <p className="text-[10px] mt-0.5" style={{ color: '#00d9ff' }}>{n.artwork.title}</p>}
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
                  <Link to="/dashboard/upload"
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg,#00d9ff,#06b6d4)', color: '#030309', boxShadow: '0 4px 16px rgba(0,217,255,0.3)' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,217,255,0.55)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,217,255,0.3)'}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                  </Link>
                )}

                {/* Profile */}
                <div ref={profileRef} className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,217,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    <img src={user.profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
                      className="h-7 w-7 rounded-full object-cover" alt="Avatar" />
                    <span className="hidden md:block text-xs font-medium" style={{ color: 'var(--text-1)' }}>{user.username}</span>
                    <ChevronDown className="hidden md:block h-3.5 w-3.5" style={{ color: 'var(--text-3)', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute right-0 top-11 w-52 rounded-2xl overflow-hidden z-50"
                        style={{ background: 'rgba(8,8,20,0.97)', border: '1px solid rgba(0,217,255,0.15)', backdropFilter: 'blur(24px)', boxShadow: '0 24px 64px rgba(0,0,0,0.9), 0 0 40px rgba(0,217,255,0.06)' }}
                      >
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-xs font-bold" style={{ color: 'var(--text-0)' }}>@{user.username}</p>
                          <p className="text-[10px] capitalize mt-0.5" style={{ color: 'var(--text-3)' }}>{user.role}</p>
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
                              style={{ color: 'var(--text-2)' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,217,255,0.05)'; e.currentTarget.style.color = '#00d9ff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-2)'; }}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {item.label}
                            </Link>
                          );
                        })}

                        <button onClick={() => { logout(); setProfileOpen(false); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs transition-colors"
                          style={{ color: '#ff4d6d', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,109,0.06)'}
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
                <Link to="/login"
                  className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
                  style={{ color: 'var(--text-2)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-0)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}
                >Sign In</Link>
                <Link to="/register"
                  className="px-4 py-2 text-xs font-bold rounded-lg transition-all"
                  style={{ background: 'linear-gradient(135deg,#00d9ff,#06b6d4)', color: '#030309', boxShadow: '0 2px 12px rgba(0,217,255,0.3)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,217,255,0.55)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,217,255,0.3)'}
                >Get Started</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg md:hidden"
              style={{ color: 'var(--text-2)' }}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            style={{ background: 'rgba(3,3,9,0.97)', borderTop: '1px solid rgba(0,217,255,0.1)' }}
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ color: isActive(l.path) ? '#00d9ff' : 'var(--text-2)', background: isActive(l.path) ? 'rgba(0,217,255,0.06)' : 'transparent' }}>
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
