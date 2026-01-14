'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const AdminLoginPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin === 'true') {
      router.push('/counselor-management-dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple password check (in production, this should be server-side)
    const ADMIN_PASSWORD = 'admin123'; // This should be environment variable in production

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        router.push('/counselor-management-dashboard');
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-3 hover:opacity-80 transition-opacity">
            <AppImage
              src="/assets/images/Logo_icon-35__1_-1768362587986.png"
              alt="TradeMax Academy Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-headline font-semibold text-foreground leading-none">
                TradeMax
              </span>
              <span className="text-xs font-body text-muted-foreground font-medium tracking-[0.3em] uppercase">
                ACADEMY
              </span>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-8 border border-white/60 backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Icon name="ShieldCheckIcon" size={32} variant="solid" className="text-primary" />
            </div>
            <h1 className="text-3xl font-headline font-semibold text-foreground mb-2">
              Admin Login
            </h1>
            <p className="text-muted-foreground font-body">
              Enter password to access counselor management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-body font-semibold text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pl-11 border rounded-2xl font-body focus:outline-none focus:ring-2 transition-all bg-white/80 ${
                    error ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-border focus:ring-primary/20 focus:border-primary'
                  }`}
                  placeholder="Enter admin password"
                  required
                  disabled={isLoading}
                />
                <Icon
                  name="LockClosedIcon"
                  size={20}
                  variant="solid"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 font-body flex items-center">
                  <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="mr-1" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-primary text-white rounded-full font-cta font-semibold shadow-[0_12px_24px_rgba(10,132,255,0.35)] hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Icon name="ArrowPathIcon" size={20} variant="outline" className="mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Icon name="ArrowRightIcon" size={20} variant="outline" className="mr-2" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60 text-center">
            <Link
              href="/multi-step-enrollment-form"
              className="text-sm text-primary hover:text-primary/80 font-body font-medium inline-flex items-center"
            >
              <Icon name="ArrowLeftIcon" size={16} variant="outline" className="mr-1" />
              Back to Enrollment
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-white/70 border border-white/60 rounded-2xl p-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
          <div className="flex items-start">
            <Icon name="InformationCircleIcon" size={20} variant="solid" className="text-primary mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-foreground/80 font-body">
              This area is restricted to authorized administrators only. Access is required to manage counselor information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
