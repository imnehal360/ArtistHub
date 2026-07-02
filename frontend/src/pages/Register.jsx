import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Palette, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Brush, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api.js';

const ART_BG = 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=900&q=85&fit=crop';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [customError,  setCustomError]  = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'visitor' } });
  const selectedRole = watch('role', 'visitor');

  const onSubmit = async (data) => {
    setLoading(true); setCustomError('');
    try {
      await API.post('/auth/register', {
        username: data.username, email: data.email, password: data.password,
        role: data.role, fullName: data.role === 'artist' ? data.fullName : undefined,
      });
      setSuccess(true);
    } catch (err) {
      setCustomError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-content min-h-screen flex" style={{ background: 'var(--bg-0)' }}>

      {/* ── Left panel ─────────────────────────────────── */}
      <div className="hidden lg:flex flex-col relative w-5/12 overflow-hidden">
        <img src={ART_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(3,3,9,0.82) 0%, rgba(168,85,247,0.06) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(168,85,247,0.2) 0%, transparent 60%)' }} />

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

          <div className="mt-auto space-y-5">
            <div className="h-px mb-2" style={{ background: 'linear-gradient(90deg, #a855f7, rgba(0,217,255,0.5), transparent)' }} />
            {[
              { color: '#00d9ff',  title: 'Build your portfolio',  desc: 'A stunning masonry gallery in minutes.' },
              { color: '#a855f7',  title: 'Grow your audience',    desc: 'Connect with collectors worldwide.' },
              { color: '#ff4d6d',  title: 'Sell your artwork',     desc: 'Earn directly from your passion.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: '#f0f0ff' }}>{f.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(240,240,255,0.45)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form ─────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-5 py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4,0,0.2,1] }}
          className="w-full max-w-md"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg,#00d9ff,#06b6d4)', boxShadow: '0 0 16px rgba(0,217,255,0.35)' }}>
              <Palette className="h-4 w-4" style={{ color: '#030309' }} />
            </div>
            <span className="font-display text-lg font-bold" style={{ color: '#f0f0ff' }}>
              Artist<span style={{ color: '#00d9ff' }}>Hub</span>
            </span>
          </Link>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="h-20 w-20 mx-auto mb-6 flex items-center justify-center rounded-full"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 0 40px rgba(16,185,129,0.15)' }}>
                  <CheckCircle className="h-10 w-10" style={{ color: '#10b981' }} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text-0)' }}>Account Created!</h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-3)' }}>
                  A verification link has been sent to your email. Check your inbox and spam folder.
                </p>
                <Link to="/login" className="btn-primary w-full justify-center">
                  Go to Sign In <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-0)' }}>
                  Create account
                </h2>
                <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>
                  Already a member?{' '}
                  <Link to="/login" className="font-bold transition-colors" style={{ color: '#00d9ff' }}
                    onMouseEnter={e => e.currentTarget.style.textShadow = '0 0 10px rgba(0,217,255,0.5)'}
                    onMouseLeave={e => e.currentTarget.style.textShadow = 'none'}
                  >Sign in →</Link>
                </p>

                {customError && (
                  <div className="flex gap-3 p-3.5 rounded-xl mb-5 text-xs"
                    style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)', color: '#ff8fa3' }}>
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {customError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Role selector */}
                  <div>
                    <label className="block text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
                      Join as
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'visitor', icon: Globe, label: 'Art Enthusiast', desc: 'Browse & collect', color: '#00d9ff' },
                        { value: 'artist',  icon: Brush, label: 'Artist Creator',  desc: 'Create & sell',  color: '#a855f7' },
                      ].map(({ value, icon: Icon, label, desc, color }) => (
                        <label key={value} className="relative cursor-pointer">
                          <input type="radio" value={value} {...register('role')} className="sr-only" />
                          <div className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200"
                            style={{
                              background: selectedRole === value ? `${color}10` : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${selectedRole === value ? color + '55' : 'rgba(255,255,255,0.07)'}`,
                              boxShadow: selectedRole === value ? `0 0 20px ${color}18` : 'none',
                            }}>
                            <Icon className="h-5 w-5" style={{ color: selectedRole === value ? color : 'var(--text-3)' }} />
                            <div>
                              <p className="text-xs font-bold" style={{ color: selectedRole === value ? 'var(--text-0)' : 'var(--text-2)' }}>{label}</p>
                              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{desc}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Full name (artist) */}
                  <AnimatePresence>
                    {selectedRole === 'artist' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>Full Name</label>
                        <input type="text" {...register('fullName', { required: 'Full name is required for artists' })}
                          placeholder="Your display name" className="input-field" />
                        {errors.fullName && <p className="mt-1.5 text-[10px]" style={{ color: '#ff8fa3' }}>{errors.fullName.message}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>Username</label>
                    <input type="text"
                      {...register('username', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })}
                      placeholder="johndoe" className="input-field" />
                    {errors.username && <p className="mt-1.5 text-[10px]" style={{ color: '#ff8fa3' }}>{errors.username.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>Email</label>
                    <input type="email"
                      {...register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                      placeholder="you@domain.com" className="input-field" />
                    {errors.email && <p className="mt-1.5 text-[10px]" style={{ color: '#ff8fa3' }}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                        placeholder="••••••••" className="input-field pr-11"
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

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 mt-2"
                    style={{
                      background: loading ? 'rgba(0,217,255,0.3)' : 'linear-gradient(135deg,#00d9ff,#06b6d4)',
                      color: '#030309',
                      boxShadow: loading ? 'none' : '0 4px 24px rgba(0,217,255,0.4), 0 0 0 1px rgba(0,217,255,0.2)',
                    }}
                  >
                    {loading ? 'Creating…' : <>Create Account <ArrowRight className="h-4 w-4" /></>}
                  </button>

                  <p className="text-[10px] text-center" style={{ color: 'var(--text-3)' }}>
                    By registering you agree to our{' '}
                    <a href="#" style={{ color: 'var(--text-2)' }}>Terms</a> &{' '}
                    <a href="#" style={{ color: 'var(--text-2)' }}>Privacy Policy</a>.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
