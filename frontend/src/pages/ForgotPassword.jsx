import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await API.post('/auth/forgot-password', { email: data.email });
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-6 rounded-2xl glass p-8 shadow-xl"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white font-display">Forgot Password</h2>
          <p className="mt-2 text-xs text-slate-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-green-500/10 p-5 text-center text-slate-200">
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
            <h3 className="mt-3 text-base font-bold text-white">Reset Link Sent</h3>
            <p className="mt-2 text-xs text-slate-300">
              A recovery link has been sent to your email (and logged in the server console). Please check your email inbox.
            </p>
            <Link
              to="/login"
              className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="flex gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 pl-10 text-sm text-white outline-none focus:border-brand-500"
                    placeholder="you@domain.com"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
                {errors.email && (
                  <span className="mt-1 text-[10px] text-red-500">{errors.email.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? 'Requesting Link...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
