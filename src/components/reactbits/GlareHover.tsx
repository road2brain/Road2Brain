import React, { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface GlareHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  borderRadius?: string;
  mode?: 'hover' | 'always';
  variant?: 'streak' | 'radial';
  glareColor?: string;
  glareOpacity?: number;
  glareSize?: number;
  softness?: number;
  glareAngle?: number;
  blendMode?: 'screen' | 'overlay' | 'lighten';
  rimGlint?: boolean;
  transitionDuration?: number;
  className?: string;
  children?: React.ReactNode;
}

export const GlareHover: React.FC<GlareHoverProps> = ({
  width = '100%',
  height = 'auto',
  borderRadius = '20px',
  mode = 'hover',
  variant = 'streak',
  glareColor = '#ffffff',
  glareOpacity = 0.45,
  glareSize = 35,
  glareAngle = -45,
  blendMode = 'screen',
  rimGlint = true,
  transitionDuration = 600,
  className = '',
  children,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(mode === 'always');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => mode !== 'always' && setIsHovered(false)}
      style={{
        width,
        height,
        borderRadius,
      }}
      className={cn(
        'relative overflow-hidden group select-none shadow-sm transition-transform duration-300 hover:scale-[1.01]',
        className
      )}
      {...props}
    >
      {/* Underlying Content */}
      <div className="w-full h-full relative z-10">{children}</div>

      {/* Rim Glint Border */}
      {rimGlint && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            borderRadius,
            opacity: isHovered ? 0.7 : 0,
            boxShadow: `inset 0 0 0 1px ${glareColor}40`,
          }}
        />
      )}

      {/* Moving Specular Glare */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity"
        style={{
          borderRadius,
          opacity: isHovered ? glareOpacity : 0,
          transition: `opacity ${transitionDuration}ms ease-out`,
          mixBlendMode: blendMode,
          background:
            variant === 'streak'
              ? `linear-gradient(${glareAngle}deg, transparent ${pos.x - glareSize}%, ${glareColor} ${pos.x}%, transparent ${pos.x + glareSize}%)`
              : `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${glareColor} 0%, transparent ${glareSize * 2}%)`,
        }}
      />
    </div>
  );
};

export default GlareHover;
