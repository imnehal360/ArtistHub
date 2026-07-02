import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import API from '../services/api.js';
import {
  Search,
  Bell,
  Mail,
  Sun,
  Moon,
  Upload,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  Settings,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isArtist, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close menus on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestionsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search suggestions logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await API.get(`/artworks/suggestions?q=${searchQuery}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
      setUnreadNotifsCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // poll every 20s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleMarkNotifsRead = async () => {
    try {
      await API.put('/notifications/read');
      setUnreadNotifsCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/explore?search=${searchQuery}`);
      setSuggestionsOpen(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery('');
    setSuggestionsOpen(false);
    if (item.type === 'artist') {
      navigate(`/artist/${item.username}`);
    } else {
      navigate(`/artwork/${item.id}`);
    }
  };

  return (
    <nav className="glass sticky top-0 z-50 w-full border-b border-white/10 px-4 py-3 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          <Sparkles className="h-6 w-6 text-brand-500 animate-pulse" />
          <span>Artist<span className="text-brand-500">Hub</span></span>
        </Link>

        {/* SEARCH BAR (DESKTOP) */}
        <div ref={searchRef} className="relative hidden w-full max-w-md md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search artworks, artists, tags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSuggestionsOpen(true);
              }}
              onFocus={() => setSuggestionsOpen(true)}
              className="w-full rounded-full bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-brand-500/20 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-950"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </form>

          {/* Suggestions Dropdown */}
          {suggestionsOpen && suggestions.length > 0 && (
            <div className="absolute top-11 left-0 z-50 w-full rounded-xl border border-white/10 bg-white p-2 shadow-lg dark:bg-slate-900">
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSuggestionClick(item)}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {item.text}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">{item.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTROLS & NAVIGATION */}
        <div className="flex items-center gap-4">
          <Link
            to="/explore"
            className="hidden text-sm font-medium text-slate-600 hover:text-brand-500 dark:text-slate-300 dark:hover:text-white md:block"
          >
            Explore
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Messages Shortcut */}
              <Link
                to="/dashboard/messages"
                className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </Link>

              {/* Notifications Dropdown */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen) handleMarkNotifsRead();
                  }}
                  className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-white/10 bg-white p-3 shadow-xl dark:bg-slate-900">
                    <h4 className="border-b border-slate-100 pb-2 font-display text-sm font-semibold dark:border-slate-800">
                      Notifications
                    </h4>
                    <div className="mt-2 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="py-8 text-center text-xs text-slate-400">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`flex gap-3 rounded-lg p-2 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                              !n.isRead ? 'bg-brand-500/5' : ''
                            }`}
                          >
                            <img
                              src={n.senderProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                              alt="Avatar"
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                @{n.sender?.username}
                              </span>{' '}
                              <span className="text-slate-500">
                                {n.type === 'like' && 'liked your artwork'}
                                {n.type === 'comment' && 'commented on your work'}
                                {n.type === 'follow' && 'started following you'}
                                {n.type === 'message' && 'sent you a message'}
                              </span>
                              {n.artwork && (
                                <p className="mt-1 font-medium text-brand-500 truncate max-w-[180px]">
                                  {n.artwork.title}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Artwork Shortcut */}
              {isArtist && (
                <Link
                  to="/dashboard/upload"
                  className="hidden items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 md:flex"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
              )}

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full outline-none"
                >
                  <img
                    src={user.profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt="User Profile"
                    className="h-8 w-8 rounded-full border border-brand-500/20 object-cover"
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-white/10 bg-white p-1 shadow-lg dark:bg-slate-900">
                    <div className="border-b border-slate-100 p-2 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        @{user.username}
                      </p>
                      <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                    </div>

                    {isArtist && (
                      <>
                        <Link
                          to={`/artist/${user.username}`}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <User className="h-4 w-4" />
                          <span>Public Profile</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <Link
                      to={isArtist ? "/dashboard/settings" : "/dashboard/settings"} // settings tab is inside dashboard
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-500/5"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mt-4 flex flex-col gap-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-900 md:hidden">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore
          </Link>
          {isAuthenticated && isArtist && (
            <Link
              to="/dashboard/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-brand-500"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Artwork</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
