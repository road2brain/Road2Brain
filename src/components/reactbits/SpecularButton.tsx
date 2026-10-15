import React, { useRef, useState, useCallback } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SpecularButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  idleIntensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  glow?: number;
  followMouse?: boolean;
  proximity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const SpecularButton: React.FC<SpecularButtonProps> = ({
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0.08,
  textColor = '#ffffff',
  lineColor = '#ffffff',
  baseColor = '#2563EB',
  intensity = 1,
  idleIntensity = 0.35,
  shineSize = 120,
  thickness = 1.5,
  glow = 1,
  followMouse = true,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !followMouse) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, [followMouse]);

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-bold',
    md: 'px-5 py-2.5 text-sm font-bold',
    lg: 'px-7 py-3.5 text-base font-extrabold',
  };

  const currentIntensity = isHovered ? intensity : idleIntensity;

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        borderRadius: `${radius}px`,
        backgroundColor: baseColor,
        color: textColor,
      }}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden font-sans shadow-lg cursor-pointer select-none transition-shadow duration-300',
        glow > 0 && isHovered && 'shadow-blue-500/35',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* 1. Specular Border Line Reflection */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          borderRadius: `${radius}px`,
          padding: `${thickness}px`,
          opacity: currentIntensity,
          background: followMouse
            ? `radial-gradient(${shineSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${lineColor}, transparent 70%)`
            : `linear-gradient(135deg, ${lineColor} 0%, transparent 60%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* 2. Surface Specular Sheen */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          borderRadius: `${radius}px`,
          opacity: isHovered ? tintOpacity * 2 : tintOpacity,
          background: followMouse
            ? `radial-gradient(${shineSize * 1.5}px circle at ${mousePos.x}px ${mousePos.y}px, ${tint}, transparent 80%)`
            : undefined,
        }}
      />

      {/* 3. Text & Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default SpecularButton;
