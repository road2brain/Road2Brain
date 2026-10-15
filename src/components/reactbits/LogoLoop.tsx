import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  className?: string;
}

export const LogoLoop: React.FC<LogoLoopProps> = ({
  logos,
  speed = 40,
  direction = 'left',
  logoHeight = 44,
  gap = 48,
  hoverSpeed = 0,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = '#F8FAFC',
  ariaLabel = 'Partner organizations',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Triple array to ensure seamless infinite loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  const isHorizontal = direction === 'left' || direction === 'right';
  const initialOffset = direction === 'left' || direction === 'up' ? '0%' : '-50%';
  const targetOffset = direction === 'left' || direction === 'up' ? '-50%' : '0%';

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative overflow-hidden w-full py-4', className)}
    >
      {/* Edge Fade Masks */}
      {fadeOut && isHorizontal && (
        <>
          <div
            style={{
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
            }}
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
          />
          <div
            style={{
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
            }}
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
          />
        </>
      )}

      <motion.div
        animate={
          isHorizontal
            ? { x: [initialOffset, targetOffset] }
            : { y: [initialOffset, targetOffset] }
        }
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: isHovered && hoverSpeed === 0 ? 999999 : speed,
          ease: 'linear',
        }}
        style={{ gap: `${gap}px` }}
        className="flex items-center w-max select-none"
      >
        {duplicatedLogos.map((item, index) => {
          const content = (
            <motion.div
              whileHover={scaleOnHover ? { scale: 1.1 } : {}}
              style={{ height: `${logoHeight}px` }}
              className="flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-200 cursor-pointer px-2"
              title={item.title || item.alt}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt || item.title || 'Partner'}
                  style={{ height: `${logoHeight}px` }}
                  className="w-auto object-contain"
                />
              ) : (
                <div style={{ fontSize: `${logoHeight * 0.75}px` }}>
                  {item.node}
                </div>
              )}
            </motion.div>
          );

          return item.href ? (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.title || item.alt || 'Partner Link'}
            >
              {content}
            </a>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LogoLoop;
