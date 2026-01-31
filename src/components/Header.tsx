'use client';

import { useState } from 'react';
import { Menu, X, TrendingUp, Bell, FileText, Settings } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onNotificationClick: () => void;
}

export default function Header({ onNotificationClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-accent-blue" />
            <span className="text-xl font-bold gradient-text hidden sm:block">
              FinDash
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-dark-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/reports"
              className="text-dark-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Reports
            </Link>
            <button
              onClick={onNotificationClick}
              className="text-dark-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
            <Link
              href="/settings"
              className="text-dark-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-dark-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-dark-700">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-dark-300 hover:text-white p-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <TrendingUp className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-dark-300 hover:text-white p-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <FileText className="h-5 w-5" />
              Reports
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNotificationClick();
              }}
              className="flex items-center gap-3 text-dark-300 hover:text-white p-2 rounded-lg hover:bg-dark-800 transition-colors w-full"
            >
              <Bell className="h-5 w-5" />
              Notifications
            </button>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-dark-300 hover:text-white p-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
