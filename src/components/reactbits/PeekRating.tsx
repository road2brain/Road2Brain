import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PeekRatingProps {
  defaultValue?: number;
  count?: number;
  shape?: 'star' | 'heart' | 'thumb';
  labels?: string[];
  activeColor?: string;
  idleColor?: string;
  tipColor?: string;
  tipTextColor?: string;
  size?: number;
  lift?: number;
  magnify?: number;
  riseDuration?: number;
  popScale?: number;
  showTip?: boolean;
  allowClear?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  readOnly?: boolean;
}

export const PeekRating: React.FC<PeekRatingProps> = ({
  defaultValue = 0,
  count = 5,
  shape = 'star',
  labels = ['Poor', 'Fair', 'Good', 'Great', 'Superb'],
  activeColor = '#f5b400',
  idleColor = '#94a3b8',
  tipColor = '#1e293b',
  tipTextColor = '#f8fafc',
  size = 32,
  lift = 7,
  magnify = 1.15,
  riseDuration = 320,
  popScale = 1.3,
  showTip = true,
  allowClear = true,
  onChange,
  className = '',
  readOnly = false,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const displayValue = hoverIndex !== null ? hoverIndex : value;

  const handleClick = (idx: number) => {
    if (readOnly) return;
    const nextVal = allowClear && value === idx ? 0 : idx;
    setValue(nextVal);
    onChange?.(nextVal);
  };

  const renderIcon = (isActive: boolean) => {
    const iconProps = {
      size,
      fill: isActive ? activeColor : 'none',
      stroke: isActive ? activeColor : idleColor,
      strokeWidth: 1.75,
      className: 'transition-colors duration-150',
    };

    switch (shape) {
      case 'heart':
        return <Heart {...iconProps} />;
      case 'thumb':
        return <ThumbsUp {...iconProps} />;
      case 'star':
      default:
        return <Star {...iconProps} />;
    }
  };

  return (
    <div className={cn('relative inline-flex items-center gap-1.5 py-2 select-none', className)}>
      {Array.from({ length: count }, (_, i) => i + 1).map(idx => {
        const isHovered = hoverIndex === idx;
        const isActive = idx <= displayValue;
        const labelText = labels[idx - 1];

        return (
          <div
            key={idx}
            className="relative flex flex-col items-center"
            onMouseEnter={() => !readOnly && setHoverIndex(idx)}
            onMouseLeave={() => !readOnly && setHoverIndex(null)}
          >
            {/* Peek Tooltip */}
            <AnimatePresence>
              {showTip && isHovered && labelText && !readOnly && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.85 }}
                  animate={{ opacity: 1, y: -lift - 8, scale: 1 }}
                  exit={{ opacity: 0, y: 2, scale: 0.85 }}
                  transition={{ duration: riseDuration / 1000, ease: 'easeOut' }}
                  style={{ backgroundColor: tipColor, color: tipTextColor }}
                  className="absolute bottom-full mb-1 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-lg pointer-events-none whitespace-nowrap z-30 flex flex-col items-center"
                >
                  {labelText}
                  <div
                    className="w-1.5 h-1.5 rotate-45 -mb-1 mt-0.5"
                    style={{ backgroundColor: tipColor }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interactive Rating Shape */}
            <motion.button
              type="button"
              disabled={readOnly}
              onClick={() => handleClick(idx)}
              whileHover={!readOnly ? { y: -lift, scale: magnify } : {}}
              whileTap={!readOnly ? { scale: popScale } : {}}
              transition={{ duration: riseDuration / 1000, ease: 'backOut' }}
              className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 rounded-lg cursor-pointer disabled:cursor-default"
              aria-label={`Rate ${idx} of ${count} - ${labelText || ''}`}
            >
              {renderIcon(isActive)}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};

export default PeekRating;
