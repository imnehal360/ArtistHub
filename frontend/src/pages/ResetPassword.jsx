import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import { AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const newPassword = watch('password');

  const onSubmit = async (data) => {
    if (!token) {
      setErrorMsg('No reset token found in URL.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await API.post(`/auth/reset-password/${token}`, { password: data.password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Password reset failed. Link may be invalid or expired.');
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
          <h2 className="text-2xl font-bold tracking-tight text-white font-display">Reset Password</h2>
          <p className="mt-2 text-xs text-slate-400">
            Please enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-green-500/10 p-5 text-center text-slate-200">
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
            <h3 className="mt-3 text-base font-bold text-white">Password Updated</h3>
            <p className="mt-2 text-xs text-slate-300">
              Your password has been changed successfully. Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            {(!token) && (
              <div className="flex gap-2 rounded-lg bg-yellow-500/10 p-3 text-xs text-yellow-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Reset token is missing from the link. Check your email again.</span>
              </div>
            )}
            {errorMsg && (
              <div className="flex gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-brand-500"
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (value) => value === newPassword || 'Passwords do not match'
                  })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-brand-500"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <span className="mt-1 text-[10px] text-red-500">{errors.confirmPassword.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword;
