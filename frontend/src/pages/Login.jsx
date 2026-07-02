import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Palette, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ART_IMGS = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=85&fit=crop',
  'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=900&q=85&fit=crop',
];

const Login = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [customError,  setCustomError]  = useState('');

  const expired  = searchParams.get('expired');
  const verified = searchParams.get('verified');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true); setCustomError('');
    try {
      const user = await login(data.emailOrUsername, data.password);
      navigate(user.role === 'admin' ? '/admin' : '/explore');
    } catch (err) {
      setCustomError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-content min-h-screen flex" style={{ background: 'var(--bg-0)' }}>

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col relative w-5/12 overflow-hidden">
        <img src={ART_IMGS[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(3,3,9,0.8) 0%, rgba(0,217,255,0.05) 100%)' }} />
        {/* Colored glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at bottom left, rgba(0,217,255,0.15) 0%, transparent 60%)' }} />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg,#00d9ff,#06b6d4)', boxShadow: '0 0 24px rgba(0,217,255,0.4)' }}>
              <Palette className="h-5 w-5" style={{ color: '#030309' }} />
            </div>
            <span className="font-display text-xl font-bold" style={{ color: '#f0f0ff' }}>
              Artist<span style={{ color: '#00d9ff' }}>Hub</span>
            </span>
          </Link>

          <div className="mt-auto">
            <div className="w-12 h-0.5 mb-6" style={{ background: 'linear-gradient(90deg, #00d9ff, #a855f7)' }} />
            <blockquote className="font-display text-2xl italic font-bold leading-snug mb-5" style={{ color: '#f0f0ff' }}>
              "Art enables us to find ourselves and lose ourselves at the same time."
            </blockquote>
            <p className="text-sm" style={{ color: 'rgba(240,240,255,0.4)' }}>— Thomas Merton</p>
          </div>
        </div>
      </div>

      {/* ── Right form ─────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4,0,0.2,1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg,#00d9ff,#06b6d4)', boxShadow: '0 0 16px rgba(0,217,255,0.35)' }}>
              <Palette className="h-4 w-4" style={{ color: '#030309' }} />
            </div>
            <span className="font-display text-lg font-bold" style={{ color: '#f0f0ff' }}>
              Artist<span style={{ color: '#00d9ff' }}>Hub</span>
            </span>
          </Link>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-0)' }}>
            Welcome back
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>
            Don't have an account?{' '}
            <Link to="/register"
              className="font-bold transition-colors"
              style={{ color: '#00d9ff' }}
              onMouseEnter={e => e.currentTarget.style.textShadow = '0 0 10px rgba(0,217,255,0.5)'}
              onMouseLeave={e => e.currentTarget.style.textShadow = 'none'}
            >Create one free →</Link>
          </p>

          {/* Notices */}
          {expired && (
            <div className="flex gap-3 p-3.5 rounded-xl mb-5 text-xs"
              style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              Session expired. Please sign in again.
            </div>
          )}
          {verified && (
            <div className="flex gap-3 p-3.5 rounded-xl mb-5 text-xs"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              Email verified! You can now sign in.
            </div>
          )}
          {(customError || authError) && (
            <div className="flex gap-3 p-3.5 rounded-xl mb-5 text-xs"
              style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', color: '#ff8fa3' }}>
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {customError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
                Username or Email
              </label>
              <input type="text"
                {...register('emailOrUsername', { required: 'Required' })}
                placeholder="username or email@domain.com"
                className="input-field"
              />
              {errors.emailOrUsername && <p className="mt-1.5 text-[10px]" style={{ color: '#ff8fa3' }}>{errors.emailOrUsername.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>Password</label>
                <Link to="/forgot-password" className="text-[10px] font-semibold transition-colors" style={{ color: '#00d9ff' }}>
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Required' })}
                  placeholder="••••••••"
                  className="input-field pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-3)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-[10px]" style={{ color: '#ff8fa3' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? 'rgba(0,217,255,0.3)' : 'linear-gradient(135deg,#00d9ff,#06b6d4)',
                color: '#030309',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(0,217,255,0.4), 0 0 0 1px rgba(0,217,255,0.2)',
              }}
            >
              {loading ? 'Signing In…' : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
