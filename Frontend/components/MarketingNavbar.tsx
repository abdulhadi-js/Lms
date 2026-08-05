"use client";

import { GraduationCap, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export function MarketingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Enterprise Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-divider py-3 px-4 md:py-4 md:px-[32px] flex justify-between items-center shadow-sm">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary group-hover:bg-primary/90 transition-colors rounded-lg flex items-center justify-center shadow-md shrink-0">
            <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-on-primary" />
          </div>
          <span className="font-heading font-bold text-[18px] md:text-[24px] text-heading-on-light tracking-tight hidden sm:block group-hover:text-primary transition-colors">EduCore ERP</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="text-body-secondary hover:text-primary font-medium text-sm transition-colors">About Us</Link>
          <Link href="/#modules" className="text-body-secondary hover:text-primary font-medium text-sm transition-colors">Core Modules</Link>
          <Link href="/contact" className="text-body-secondary hover:text-primary font-medium text-sm transition-colors">Contact</Link>
        </div>
        
        <div className="flex space-x-2 md:space-x-4 items-center shrink-0">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:inline-flex px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors whitespace-nowrap">Portal Login</Link>
          <Link href="/apply" className="hidden md:inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-on-primary bg-primary rounded-md hover:opacity-90 transition-opacity shadow-sm">Apply Admission</Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 -mr-2 text-body-secondary hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] sm:top-[72px] left-0 w-full bg-surface border-b border-divider shadow-xl z-40 animate-fade-in-up origin-top">
          <div className="flex flex-col p-5 space-y-5">
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-on-surface hover:text-primary text-lg">About Us</Link>
            <Link href="/#modules" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-on-surface hover:text-primary text-lg">Core Modules</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-on-surface hover:text-primary text-lg">Contact</Link>
            <div className="border-t border-divider pt-5 flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 font-semibold text-primary bg-primary/10 rounded-md">Portal Login</Link>
              <Link href="/apply" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 font-semibold text-on-primary bg-primary rounded-md shadow-sm">Apply Admission</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
