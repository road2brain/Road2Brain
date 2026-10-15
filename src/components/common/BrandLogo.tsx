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
      <img
        src={variant === 'icon' ? '/logo-emblem-clean.png' : '/logo.png'}
        alt="Road 2 Brain - Learn • Build • Grow"
        className={
          variant === 'icon' 
            ? 'h-9 w-9 object-contain rounded-lg' 
            : 'h-10 sm:h-12 w-auto max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-[1.02]'
        }
      />
    </Link>
  );
};
