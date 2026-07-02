import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register: signupError } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState('visitor');
  const [customError, setCustomError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'visitor'
    }
  });

  const selectedRole = watch('role', 'visitor');

  const onSubmit = async (data) => {
    setLoading(true);
    setCustomError('');
    try {
      await API.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        fullName: data.role === 'artist' ? data.fullName : undefined
      });
      setSuccess(true);
    } catch (err) {
      setCustomError(err.response?.data?.message || 'Registration failed');
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
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-white font-display">Create your account</h2>
          <p className="mt-2 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
              Sign in
            </Link>
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-green-500/10 p-6 text-center text-slate-200">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-lg font-bold font-display text-white">Registration Successful!</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              We've sent a verification link to your email address. 
              Please check your inbox (and spam/promotions folders) or search logs to complete verification.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block w-full rounded-xl bg-brand-500 py-3 text-xs font-semibold text-white hover:bg-brand-600"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {(customError || signupError) && (
              <div className="flex gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{customError || signupError}</span>
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              
              {/* Role selector buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">I want to join as a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 text-center transition-all ${
                      selectedRole === 'visitor'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-semibold'
                        : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      value="visitor"
                      {...register('role')}
                      className="hidden"
                    />
                    <span className="text-xs">Visitor / Art Lover</span>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-xl border p-3 text-center transition-all ${
                      selectedRole === 'artist'
                        ? 'border-brand-500 bg-brand-500/10 text-white font-semibold'
                        : 'border-white/10 bg-slate-900/40 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      value="artist"
                      {...register('role')}
                      className="hidden"
                    />
                    <span className="text-xs">Artist Creator</span>
                  </label>
                </div>
              </div>

              {/* Full Name for Artists */}
              {selectedRole === 'artist' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Full name is required for artists' })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <span className="mt-1 text-[10px] text-red-500">{errors.fullName.message}</span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                  })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                  placeholder="johndoe"
                />
                {errors.username && (
                  <span className="mt-1 text-[10px] text-red-500">{errors.username.message}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z5-9]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
                  placeholder="you@domain.com"
                />
                {errors.email && (
                  <span className="mt-1 text-[10px] text-red-500">{errors.email.message}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

// Internal Import of API client
import API from '../services/api.js';

export default Register;
