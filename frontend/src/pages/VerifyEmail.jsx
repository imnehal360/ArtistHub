import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api.js';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided in the URL.');
        return;
      }

      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');
        
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    performVerification();
  }, [token, navigate]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl glass p-8 text-center shadow-xl"
      >
        {status === 'verifying' && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="h-12 w-12 text-brand-500 animate-spin" />
            <h3 className="mt-4 text-lg font-bold text-white font-display">Verifying Email</h3>
            <p className="mt-2 text-xs text-slate-400">Please wait while we confirm your credentials...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-6">
            <CheckCircle className="h-14 w-14 text-green-500" />
            <h3 className="mt-4 text-lg font-bold text-white font-display">Email Verified!</h3>
            <p className="mt-2 text-xs text-slate-300">{message}</p>
            <p className="mt-4 text-[10px] text-slate-500">Redirecting to login page...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-6">
            <XCircle className="h-14 w-14 text-red-500" />
            <h3 className="mt-4 text-lg font-bold text-white font-display">Verification Failed</h3>
            <p className="mt-2 text-xs text-red-400">{message}</p>
            <button
              onClick={() => navigate('/register')}
              className="mt-6 rounded-xl bg-brand-500 px-6 py-2.5 text-xs font-semibold text-white hover:bg-brand-600"
            >
              Back to Registration
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
