'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Enrollment', href: '/multi-step-enrollment-form', icon: 'AcademicCapIcon' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-[0_1px_0_rgba(255,255,255,0.7),0_10px_30px_rgba(15,23,42,0.08)] ${className}`}>
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-6">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-fast">
            <div className="relative w-11 h-11 flex items-center justify-center bg-foreground rounded-2xl shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
              <AppImage
                src="/assets/images/Logo_icon-35__1_-1768362587986.png"
                alt="TradeMax Academy Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-headline font-semibold text-foreground leading-none tracking-tight">
                TradeMax
              </span>
              <span className="text-xs font-body text-muted-foreground font-medium tracking-[0.3em] uppercase">
                ACADEMY
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-full text-foreground/70 hover:bg-black/5 hover:text-foreground transition-all duration-fast font-body font-medium"
              >
                <Icon name={item.icon as any} size={20} variant="outline" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/multi-step-enrollment-form"
              className="px-6 py-2.5 bg-primary text-white rounded-full font-cta font-semibold shadow-[0_12px_24px_rgba(10,132,255,0.35)] hover:bg-primary/90 transition-all duration-fast"
            >
              Enroll Now
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors duration-fast"
            aria-label="Toggle mobile menu"
          >
            <Icon
              name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
              size={24}
              variant="outline"
            />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-t border-white/60 backdrop-blur-xl">
            <nav className="flex flex-col py-4 px-6 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-foreground/70 hover:bg-black/5 hover:text-foreground transition-all duration-fast font-body font-medium"
                >
                  <Icon name={item.icon as any} size={20} variant="outline" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-white/60">
                <Link
                  href="/multi-step-enrollment-form"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-3 bg-primary text-white rounded-full font-cta font-semibold shadow-[0_12px_24px_rgba(10,132,255,0.35)] hover:bg-primary/90 transition-all duration-fast"
                >
                  Enroll Now
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
