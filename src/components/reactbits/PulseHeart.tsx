import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PulseHeartProps {
  count?: number;
  defaultLiked?: boolean;
  onChange?: (liked: boolean, count: number) => void;
  showCount?: boolean;
  icon?: 'heart' | 'sparkle' | 'thumb';
  idleOutline?: boolean;
  size?: number;
  corner?: number;
  likedColor?: string;
  idleColor?: string;
  pillColor?: string;
  textColor?: string;
  duration?: number;
  dotSize?: number;
  overshoot?: number;
  beat?: number;
  rollDuration?: number;
  className?: string;
}

export const PulseHeart: React.FC<PulseHeartProps> = ({
  count = 0,
  defaultLiked = false,
  onChange,
  showCount = true,
  icon = 'heart',
  idleOutline = true,
  size = 36,
  corner = 32,
  likedColor = '#ff4d6d',
  idleColor = '#64748b',
  pillColor = 'rgba(255, 255, 255, 0.95)',
  textColor = '#0f172a',
  duration = 560,
  dotSize = 0.3,
  overshoot = 1.6,
  className = '',
}) => {
  const [liked, setLiked] = useState(defaultLiked);
  const [currentCount, setCurrentCount] = useState(count);
  const [isSparking, setIsSparking] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextLiked = !liked;
    const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

    setLiked(nextLiked);
    setCurrentCount(nextCount);
    if (nextLiked) {
      setIsSparking(true);
      setTimeout(() => setIsSparking(false), duration);
    }
    onChange?.(nextLiked, nextCount);
  };

  const renderIcon = () => {
    const iconSize = Math.round(size * 0.48);
    const iconProps = {
      size: iconSize,
      fill: liked ? likedColor : idleOutline ? 'none' : idleColor,
      stroke: liked ? likedColor : idleColor,
      strokeWidth: 2,
    };

    switch (icon) {
      case 'sparkle':
        return <Sparkles {...iconProps} />;
      case 'thumb':
        return <ThumbsUp {...iconProps} />;
      case 'heart':
      default:
        return <Heart {...iconProps} />;
    }
  };

  // Spark burst particles
  const particleAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        borderRadius: `${corner}px`,
        backgroundColor: pillColor,
        color: textColor,
        minHeight: `${size}px`,
      }}
      className={cn(
        'relative inline-flex items-center gap-1.5 px-3 py-1 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 cursor-pointer',
        className
      )}
      aria-label={liked ? 'Unlike opportunity' : 'Like opportunity'}
    >
      {/* Spark Burst Effect */}
      <AnimatePresence>
        {isSparking && (
          <div className="absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {particleAngles.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const dist = size * 0.75;
              const x = Math.cos(rad) * dist;
              const y = Math.sin(rad) * dist;

              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: dotSize * 3, x, y }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: duration / 1000, ease: 'easeOut' }}
                  style={{ backgroundColor: likedColor }}
                  className="absolute w-1.5 h-1.5 rounded-full"
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Pulsing Animated Icon */}
      <motion.div
        animate={
          liked
            ? {
                scale: [1, overshoot, 0.9, 1.15, 1],
                rotate: [0, -12, 12, -4, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: duration / 1000, ease: 'easeInOut' }}
        className="flex items-center justify-center shrink-0"
      >
        {renderIcon()}
      </motion.div>

      {/* Count */}
      {showCount && (
        <span className="text-xs font-bold tabular-nums min-w-[20px] text-left">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentCount}
              initial={{ opacity: 0, y: liked ? 4 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: liked ? -4 : 4 }}
              transition={{ duration: 0.18 }}
              className="inline-block"
            >
              {currentCount}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </button>
  );
};

export default PulseHeart;
