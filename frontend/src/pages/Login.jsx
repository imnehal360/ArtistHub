import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Palette, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ART_BG = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=85&fit=crop';

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
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>

      {/* ── LEFT ART PANEL ────────────────────────────── */}
      <div className="hidden lg:flex flex-col relative w-1/2 overflow-hidden">
        <img src={ART_BG} alt="Art background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,7,13,0.7) 0%, rgba(7,7,13,0.3) 100%)' }} />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.35)' }}>
              <Palette className="h-5 w-5" style={{ color: '#07070d' }} />
            </div>
            <span className="font-display text-xl font-bold" style={{ color: '#f5f0e8' }}>
              Artist<span style={{ color: '#f59e0b' }}>Hub</span>
            </span>
          </Link>

          <div className="mt-auto">
            <blockquote className="font-display text-2xl italic font-semibold leading-snug mb-6" style={{ color: '#f5f0e8' }}>
              "Art is not what you see, but what you make others see."
            </blockquote>
            <p className="text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>— Edgar Degas</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ──────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4,0,0.2,1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
              <Palette className="h-4 w-4" style={{ color: '#07070d' }} />
            </div>
            <span className="font-display text-lg font-bold" style={{ color: '#f5f0e8' }}>
              Artist<span style={{ color: '#f59e0b' }}>Hub</span>
            </span>
          </Link>

          <h2 className="font-display text-3xl font-bold mb-2" style={{ color: '#f5f0e8' }}>Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: '#5a5a70' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors"
              style={{ color: '#f59e0b' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fcd34d'}
              onMouseLeave={e => e.currentTarget.style.color = '#f59e0b'}
            >Create one free →</Link>
          </p>

          {/* Notices */}
          {expired && (
            <div className="flex gap-3 p-3.5 rounded-xl mb-5 text-xs"
              style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#fbbf24' }}>
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              Session expired. Please sign in again.
            </div>
          )}
          {verified && (
            <div className="flex gap-3 p-3.5 rounded-xl mb-5 text-xs"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              Email verified! You can now sign in.
            </div>
          )}
          {(customError || authError) && (
            <div className="flex gap-3 p-3.5 rounded-xl mb-5 text-xs"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e' }}>
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {customError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#9d9dab' }}>Username or Email</label>
              <input
                type="text"
                {...register('emailOrUsername', { required: 'Required' })}
                placeholder="username or email@domain.com"
                className="input-field"
              />
              {errors.emailOrUsername && <p className="mt-1.5 text-[10px]" style={{ color: '#f43f5e' }}>{errors.emailOrUsername.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold" style={{ color: '#9d9dab' }}>Password</label>
                <Link to="/forgot-password" className="text-[10px] transition-colors"
                  style={{ color: '#f59e0b' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fcd34d'}
                  onMouseLeave={e => e.currentTarget.style.color = '#f59e0b'}
                >Forgot password?</Link>
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
                  style={{ color: '#5a5a70' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#9d9dab'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5a5a70'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-[10px]" style={{ color: '#f43f5e' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? 'rgba(245,158,11,0.5)' : 'linear-gradient(135deg,#f59e0b,#d97706)',
                color: '#07070d',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(245,158,11,0.3)',
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
