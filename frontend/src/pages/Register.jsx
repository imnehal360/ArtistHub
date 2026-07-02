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
    <div className="page-content min-h-screen flex" style={{ background: '#000000', color: '#ffffff' }}>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col relative w-5/12 overflow-hidden" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <img src={ART_BG} alt="" className="absolute inset-0 w-full h-full object-cover bw" style={{ opacity: 0.55 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5), #000000)' }} />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link to="/" className="flex items-center gap-0 w-fit">
            <span className="font-display text-2xl leading-none tracking-widest text-white">
              ARTIST<span style={{ color: 'rgba(255,255,255,0.45)' }}>HUB</span>
            </span>
          </Link>

          <div className="mt-auto space-y-6">
            <div className="h-[1px]" style={{ background: 'rgba(255,255,255,0.15)' }} />
            {[
              { title: 'BUILD YOUR PORTFOLIO', desc: 'Curate your works in a clean, brutalist exhibition grid.' },
              { title: 'GROW YOUR AUDIENCE',   desc: 'Present your creations to collectors globally.' },
              { title: 'SELL YOUR ARTWORK',    desc: 'List your works and sell directly without middleman cuts.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-1.5 w-1.5 rounded-none mt-2 shrink-0 bg-white" />
                <div>
                  <p className="font-sans text-xs font-bold tracking-wider text-white">{f.title}</p>
                  <p className="font-sans text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel / form */}
      <div className="flex flex-1 items-center justify-center px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand header */}
          <Link to="/" className="lg:hidden flex items-center gap-0 mb-10">
            <span className="font-display text-2xl leading-none tracking-widest text-white">
              ARTIST<span style={{ color: 'rgba(255,255,255,0.45)' }}>HUB</span>
            </span>
          </Link>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center"
                  style={{ border: '1px solid #ffffff' }}>
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-display text-3xl font-bold mb-3 tracking-wider">ACCOUNT CREATED</h3>
                <p className="font-sans text-xs tracking-wider mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  A verification link has been sent to your email. Check your inbox and spam folder.
                </p>
                <Link to="/login" className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest transition-all">
                  GO TO SIGN IN <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form">
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-2 tracking-wide">
                  CREATE ACCOUNT
                </h2>
                <p className="font-sans text-xs tracking-wider mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  ALREADY A MEMBER?{' '}
                  <Link to="/login" className="font-bold underline text-white">SIGN IN →</Link>
                </p>

                {customError && (
                  <div className="flex gap-3 p-3.5 rounded-none mb-5 text-[11px] font-mono tracking-wider uppercase"
                    style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#ffffff' }}>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {customError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Role picker */}
                  <div>
                    <label className="block text-[10px] font-bold mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      JOIN AS
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'visitor', icon: Globe, label: 'ART LOVER', desc: 'Browse & collect' },
                        { value: 'artist',  icon: Brush, label: 'CREATOR',   desc: 'Create & sell' },
                      ].map(({ value, icon: Icon, label, desc }) => (
                        <label key={value} className="relative cursor-pointer">
                          <input type="radio" value={value} {...register('role')} className="sr-only" />
                          <div className="flex flex-col items-center gap-1.5 p-3 text-center transition-all duration-200"
                            style={{
                              background: selectedRole === value ? '#ffffff' : 'transparent',
                              border: '1px solid #ffffff',
                              color: selectedRole === value ? '#000000' : '#ffffff'
                            }}>
                            <Icon className="h-4 w-4" />
                            <div>
                              <p className="text-[10px] font-bold tracking-widest">{label}</p>
                              <p className="text-[9px] mt-0.5 opacity-60">{desc}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Full Name */}
                  <AnimatePresence>
                    {selectedRole === 'artist' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                          FULL NAME
                        </label>
                        <input type="text" {...register('fullName', { required: 'Full name is required' })}
                          placeholder="YOUR FULL NAME" className="input-field" />
                        {errors.fullName && <p className="mt-1.5 text-[10px] font-mono" style={{ color: '#ffffff' }}>{errors.fullName.message}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Username */}
                  <div>
                    <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>USERNAME</label>
                    <input type="text"
                      {...register('username', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })}
                      placeholder="USERNAME" className="input-field" />
                    {errors.username && <p className="mt-1.5 text-[10px] font-mono" style={{ color: '#ffffff' }}>{errors.username.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>EMAIL</label>
                    <input type="email"
                      {...register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                      placeholder="YOU@DOMAIN.COM" className="input-field" />
                    {errors.email && <p className="mt-1.5 text-[10px] font-mono" style={{ color: '#ffffff' }}>{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>PASSWORD</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                        placeholder="••••••••" className="input-field pr-11"
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

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-none font-bold text-xs uppercase tracking-widest transition-all duration-200 mt-2"
                    style={{
                      background: loading ? 'transparent' : '#ffffff',
                      color: loading ? '#ffffff' : '#000000',
                      border: '1px solid #ffffff'
                    }}
                  >
                    {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                  </button>

                  <p className="font-mono text-[9px] text-center tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    BY JOINING YOU AGREE TO OUR TERMS & PRIVACY POLICY.
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
