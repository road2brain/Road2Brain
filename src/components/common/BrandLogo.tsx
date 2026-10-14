import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  theme?: 'light' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  variant = 'full', 
  className = '', 
  theme = 'light' 
}) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group ${className}`} aria-label="Road 2 Brain Home">
      {/* Emblem SVG */}
      <div className="relative w-9 h-9 rounded-xl bg-brand-navy flex items-center justify-center shadow-md shadow-brand-navy/15 group-hover:shadow-brand-blue/20 transition-all duration-300">
        <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
          <path d="M8 32C13 25 15 20 20 20C25 20 27 15 31 8" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M12 32C15 27 17 22 22 22C26 22 28 17 32 12" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2.5"/>
          <circle cx="31" cy="8" r="3.5" fill="#14B8A6"/>
          <circle cx="20" cy="20" r="2.5" fill="#2563EB"/>
          <circle cx="8" cy="32" r="2" fill="#F59E0B"/>
        </svg>
      </div>

      {variant === 'full' && (
        <div className="flex flex-col">
          <span className={`font-extrabold text-xl tracking-tight leading-none font-sans ${theme === 'dark' ? 'text-white' : 'text-brand-navy'}`}>
            Road<span className="text-brand-blue">2</span>Brain
          </span>
          <span className="text-[9px] font-bold tracking-widest text-brand-teal uppercase mt-0.5">
            Learn • Build • Grow
          </span>
        </div>
      )}
    </Link>
  );
};
