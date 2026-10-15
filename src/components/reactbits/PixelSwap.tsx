import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PixelSwapProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  pixelSize?: number;
  gap?: number;
  pixelRadius?: number;
  pixelSpin?: number;
  pixelScale?: number;
  duration?: number;
  pixelDuration?: number;
  pattern?: 'random' | 'diagonal' | 'center';
  randomness?: number;
  fade?: boolean;
  trigger?: 'click' | 'hover';
  className?: string;
  onSwap?: (isSecond: boolean) => void;
}

export const PixelSwap: React.FC<PixelSwapProps> = ({
  firstContent,
  secondContent,
  pixelSize = 48,
  pixelScale = 0.35,
  duration = 800,
  trigger = 'click',
  className = '',
  onSwap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSecond, setIsSecond] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gridDimensions, setGridDimensions] = useState({ cols: 4, rows: 3 });

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cols = Math.max(2, Math.floor(rect.width / pixelSize));
    const rows = Math.max(2, Math.floor(rect.height / pixelSize));
    setGridDimensions({ cols, rows });
  }, [pixelSize]);

  const handleTrigger = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsSecond(prev => {
      const next = !prev;
      onSwap?.(next);
      return next;
    });
    setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  };

  const totalPixels = gridDimensions.cols * gridDimensions.rows;

  return (
    <div
      ref={containerRef}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      className={cn(
        'relative overflow-hidden cursor-pointer rounded-2xl select-none',
        className
      )}
    >
      {/* Active Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSecond ? 'second' : 'first'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {isSecond ? secondContent : firstContent}
        </motion.div>
      </AnimatePresence>

      {/* Pixel Dissolve Overlay */}
      <AnimatePresence>
        {isAnimating && (
          <div
            className="absolute inset-0 pointer-events-none grid z-20"
            style={{
              gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`,
            }}
          >
            {Array.from({ length: totalPixels }).map((_, i) => {
              const delay = (Math.random() * duration * 0.4) / 1000;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.9, 0],
                    scale: [0, 1, pixelScale],
                    backgroundColor: ['#2563EB', '#2563EB', '#14B8A6'],
                  }}
                  transition={{
                    duration: duration / 1000,
                    delay,
                    times: [0, 0.4, 1],
                    ease: 'easeInOut',
                  }}
                  className="w-full h-full rounded-sm"
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PixelSwap;
