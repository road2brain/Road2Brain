import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TiltedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  maxTilt?: number;
  scale?: number;
  perspective?: number;
  showGlare?: boolean;
  glareColor?: string;
  spotlightColor?: string;
  borderColor?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * TiltedCard - React Bits Component
 * Creates an interactive 3D perspective tilt effect with spring physics and specular glare,
 * responding dynamically to the user's cursor position.
 */
export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  maxTilt = 7,
  scale = 1.015,
  perspective = 1000,
  showGlare = true,
  glareColor = 'rgba(255, 255, 255, 0.4)',
  spotlightColor,
  borderColor,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Spring physics motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 260, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const currentScale = useTransform(
    smoothMouseX,
    [-0.5, 0, 0.5],
    [scale, scale, scale]
  );

  useEffect(() => {
    // Detect touch-only screens or user reduced-motion preference safely
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (hasCoarsePointer || prefersReducedMotion) {
        setIsTouchDevice(true);
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Normalized position from -0.5 to 0.5
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    mouseX.set(normX);
    mouseY.set(normY);

    if (showGlare) {
      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    }
  }, [isTouchDevice, mouseX, mouseY, showGlare]);

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;
    setIsHovered(true);
  }, [isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [isTouchDevice, mouseX, mouseY]);

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          isTouchDevice
            ? undefined
            : {
                rotateX,
                rotateY,
                scale: isHovered ? currentScale : 1,
                transformStyle: 'preserve-3d',
              }
        }
        className={cn(
          'relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-shadow duration-300 overflow-hidden group',
          isHovered && 'shadow-card-hover border-slate-300',
          className
        )}
        {...props}
      >
        {/* Optional Border Spotlight */}
        {borderColor && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${borderColor}, transparent 65%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
        )}

        {/* Optional Surface Spotlight */}
        {spotlightColor && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
            }}
          />
        )}

        {/* Specular Glare Layer */}
        {showGlare && !isTouchDevice && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-20"
            style={{
              opacity: isHovered ? 0.65 : 0,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, transparent 60%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {/* Card Content with subtle 3D translation */}
        <div 
          className="relative z-30 flex flex-col justify-between h-full"
          style={!isTouchDevice && isHovered ? { transform: 'translateZ(18px)' } : undefined}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};
