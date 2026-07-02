import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customError, setCustomError] = useState('');

  const expired = searchParams.get('expired');
  const verified = searchParams.get('verified');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setCustomError('');
    try {
      const user = await login(data.emailOrUsername, data.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      setCustomError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-950/90">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-8 rounded-2xl glass p-8 shadow-2xl"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-white">
            <Sparkles className="h-6 w-6 text-brand-500" />
            <span>Artist<span className="text-brand-500">Hub</span></span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-white font-display">Sign in to your account</h2>
          <p className="mt-2 text-xs text-slate-400">
            Or{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300">
              create a new artist portfolio
            </Link>
          </p>
        </div>

        {/* Notices */}
        {expired && (
          <div className="flex gap-2 rounded-lg bg-yellow-500/10 p-3 text-xs text-yellow-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Session expired. Please log in again.</span>
          </div>
        )}
        {verified && (
          <div className="flex gap-2 rounded-lg bg-green-500/10 p-3 text-xs text-green-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Email verified successfully! You can now log in.</span>
          </div>
        )}
        {(customError || authError) && (
          <div className="flex gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{customError || authError}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username or Email</label>
              <input
                type="text"
                {...register('emailOrUsername', { required: 'Username or Email is required' })}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
                placeholder="username or email"
              />
              {errors.emailOrUsername && (
                <span className="mt-1 text-[10px] text-red-500">{errors.emailOrUsername.message}</span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-brand-400 hover:text-brand-300">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <span className="mt-1 text-[10px] text-red-500">{errors.password.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none transition-all disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
