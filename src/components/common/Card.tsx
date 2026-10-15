import React from 'react';
import { cn } from '@/lib/utils';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { TiltedCard } from '@/components/reactbits/TiltedCard';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  hoverEffect?: boolean;
  spotlight?: boolean;
  tilt?: boolean;
  spotlightColor?: string;
  borderColor?: string;
  maxTilt?: number;
  scale?: number;
}

export const Card: React.FC<CardProps> = ({ 
  className, 
  hoverEffect = true, 
  spotlight = false,
  tilt = false,
  spotlightColor,
  borderColor,
  maxTilt,
  scale,
  children, 
  ...props 
}) => {
  if (tilt) {
    return (
      <TiltedCard
        maxTilt={maxTilt}
        scale={scale}
        spotlightColor={spotlightColor}
        borderColor={borderColor}
        className={className}
        {...props}
      >
        {children}
      </TiltedCard>
    );
  }

  if (spotlight) {
    return (
      <SpotlightCard
        spotlightColor={spotlightColor}
        borderColor={borderColor}
        className={className}
        {...props}
      >
        {children}
      </SpotlightCard>
    );
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 transition-all duration-200',
        hoverEffect && 'hover:shadow-card-hover hover:border-slate-300 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
