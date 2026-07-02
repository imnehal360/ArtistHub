import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ART_IMG = 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=900&q=85&fit=crop';

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
    setLoading(true);
    setCustomError('');
    try {
      const user = await login(data.emailOrUsername, data.password);
      navigate(user.role === 'admin' ? '/admin' : '/explore');
    } catch (err) {
      setCustomError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content min-h-screen flex" style={{ background: '#000000', color: '#ffffff' }}>

      {/* Left Art Panel */}
      <div className="hidden lg:flex flex-col relative w-5/12 overflow-hidden" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <img src={ART_IMG} alt="" className="absolute inset-0 w-full h-full object-cover bw" style={{ opacity: 0.6 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5), #000000)' }} />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link to="/" className="flex items-center gap-0 w-fit">
            <span className="font-display text-2xl leading-none tracking-widest text-white">
              ARTIST<span style={{ color: 'rgba(255,255,255,0.45)' }}>HUB</span>
            </span>
          </Link>

          <div className="mt-auto">
            <blockquote className="font-display text-3xl italic leading-none text-white mb-5">
              "ART ENABLES US TO FIND OURSELVES AND LOSE OURSELVES AT THE SAME TIME."
            </blockquote>
            <p className="section-tag">— Thomas Merton</p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand header */}
          <Link to="/" className="lg:hidden flex items-center gap-0 mb-10">
            <span className="font-display text-2xl leading-none tracking-widest text-white">
              ARTIST<span style={{ color: 'rgba(255,255,255,0.45)' }}>HUB</span>
            </span>
          </Link>

          <h2 className="font-display text-4xl md:text-5xl font-bold mb-2 tracking-wide">
            WELCOME BACK
          </h2>
          <p className="font-sans text-xs tracking-wider mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            NEW TO THE PLATFORM?{' '}
            <Link to="/register" className="font-bold underline text-white">
              JOIN FREE →
            </Link>
          </p>

          {/* Messages */}
          {expired && (
            <div className="flex gap-3 p-3.5 rounded-none mb-5 text-[11px] font-mono tracking-wider uppercase"
              style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#ffffff' }}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              Session expired. Please sign in again.
            </div>
          )}
          {verified && (
            <div className="flex gap-3 p-3.5 rounded-none mb-5 text-[11px] font-mono tracking-wider uppercase"
              style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#ffffff' }}>
              <CheckCircle className="h-4 w-4 shrink-0" />
              Email verified! You can now sign in.
            </div>
          )}
          {(customError || authError) && (
            <div className="flex gap-3 p-3.5 rounded-none mb-5 text-[11px] font-mono tracking-wider uppercase"
              style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#ffffff' }}>
              <AlertCircle className="h-4 w-4 shrink-0" />
              {customError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Username or Email
              </label>
              <input type="text"
                {...register('emailOrUsername', { required: 'Required' })}
                placeholder="USERNAME OR EMAIL"
                className="input-field"
              />
              {errors.emailOrUsername && <p className="mt-1.5 text-[10px] font-mono" style={{ color: '#ffffff' }}>{errors.emailOrUsername.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Password
                </label>
                <Link to="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest underline" style={{ color: '#ffffff' }}>
                  FORGOT?
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-[10px] font-mono" style={{ color: '#ffffff' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-none font-bold text-xs uppercase tracking-widest transition-all duration-200 mt-2"
              style={{
                background: loading ? 'transparent' : '#ffffff',
                color: loading ? '#ffffff' : '#000000',
                border: '1px solid #ffffff'
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;
