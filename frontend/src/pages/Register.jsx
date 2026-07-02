import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Palette, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, Brush, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api.js';

const ART_BG = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=85&fit=crop';

const Register = () => {
  const navigate = useNavigate();
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
        username: data.username,
        email:    data.email,
        password: data.password,
        role:     data.role,
        fullName: data.role === 'artist' ? data.fullName : undefined,
      });
      setSuccess(true);
    } catch (err) {
      setCustomError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>

      {/* ── LEFT ART PANEL ────────────────────────────── */}
      <div className="hidden lg:flex flex-col relative w-1/2 overflow-hidden">
        <img src={ART_BG} alt="Art background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(7,7,13,0.65) 0%, rgba(7,7,13,0.25) 100%)' }} />

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

          <div className="mt-auto space-y-4">
            {[
              { title: 'Build your portfolio', desc: 'Showcase your best work in a beautiful, curated gallery.' },
              { title: 'Grow your audience',   desc: 'Connect with collectors, fans, and fellow creatives.' },
              { title: 'Sell your artwork',    desc: 'List works for sale and earn directly from your passion.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{ background: '#f59e0b' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#f5f0e8' }}>{f.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(245,240,232,0.5)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ──────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-5 py-16">
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

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="h-20 w-20 mx-auto mb-6 flex items-center justify-center rounded-full"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <CheckCircle className="h-10 w-10" style={{ color: '#10b981' }} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3" style={{ color: '#f5f0e8' }}>Account Created!</h3>
                <p className="text-sm leading-relaxed mb-8" style={{ color: '#5a5a70' }}>
                  A verification link has been sent to your email. Check your inbox and spam folder.
                </p>
                <Link to="/login" className="btn-gold w-full justify-center">
                  Go to Sign In <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form">
                <h2 className="font-display text-3xl font-bold mb-2" style={{ color: '#f5f0e8' }}>Create your account</h2>
                <p className="text-sm mb-8" style={{ color: '#5a5a70' }}>
                  Already a member?{' '}
                  <Link to="/login" className="font-semibold transition-colors"
                    style={{ color: '#f59e0b' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fcd34d'}
                    onMouseLeave={e => e.currentTarget.style.color = '#f59e0b'}
                  >Sign in →</Link>
                </p>

                {customError && (
                  <div className="flex gap-3 p-3.5 rounded-xl mb-5 text-xs"
                    style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e' }}>
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {customError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  {/* Role selector */}
                  <div>
                    <label className="block text-xs font-semibold mb-3" style={{ color: '#9d9dab' }}>I am joining as a:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'visitor', icon: Globe,  label: 'Art Enthusiast', desc: 'Browse & collect' },
                        { value: 'artist',  icon: Brush,  label: 'Artist Creator',  desc: 'Create & sell' },
                      ].map(({ value, icon: Icon, label, desc }) => (
                        <label key={value} className="relative cursor-pointer">
                          <input type="radio" value={value} {...register('role')} className="sr-only" />
                          <div className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200"
                            style={{
                              background: selectedRole === value ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${selectedRole === value ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.08)'}`,
                            }}>
                            <Icon className="h-5 w-5" style={{ color: selectedRole === value ? '#f59e0b' : '#5a5a70' }} />
                            <div>
                              <p className="text-xs font-semibold" style={{ color: selectedRole === value ? '#f5f0e8' : '#9d9dab' }}>{label}</p>
                              <p className="text-[10px] mt-0.5" style={{ color: '#5a5a70' }}>{desc}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Full name (artist only) */}
                  <AnimatePresence>
                    {selectedRole === 'artist' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#9d9dab' }}>Full Name</label>
                        <input type="text" {...register('fullName', { required: 'Full name is required for artists' })}
                          placeholder="Your display name" className="input-field" />
                        {errors.fullName && <p className="mt-1.5 text-[10px]" style={{ color: '#f43f5e' }}>{errors.fullName.message}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#9d9dab' }}>Username</label>
                    <input type="text"
                      {...register('username', { required: 'Required', minLength: { value: 3, message: 'Min 3 characters' } })}
                      placeholder="johndoe" className="input-field" />
                    {errors.username && <p className="mt-1.5 text-[10px]" style={{ color: '#f43f5e' }}>{errors.username.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#9d9dab' }}>Email</label>
                    <input type="email"
                      {...register('email', {
                        required: 'Required',
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                      })}
                      placeholder="you@domain.com" className="input-field" />
                    {errors.email && <p className="mt-1.5 text-[10px]" style={{ color: '#f43f5e' }}>{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#9d9dab' }}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })}
                        placeholder="••••••••" className="input-field pr-11"
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
                    {loading ? 'Creating Account…' : <>Create Account <ArrowRight className="h-4 w-4" /></>}
                  </button>

                  <p className="text-[10px] text-center" style={{ color: '#333342' }}>
                    By creating an account you agree to our{' '}
                    <a href="#" style={{ color: '#5a5a70' }}>Terms of Service</a> and{' '}
                    <a href="#" style={{ color: '#5a5a70' }}>Privacy Policy</a>.
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
