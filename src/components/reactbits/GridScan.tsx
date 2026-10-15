import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GridScanProps {
  linesColor?: string;
  scanColor?: string;
  cells?: number;
  depth?: number;
  scanDuration?: number;
  scanDelay?: number;
  clickEffect?: 'ping' | 'ripple' | 'none';
  className?: string;
}

interface Ping {
  id: number;
  x: number;
  y: number;
}

export const GridScan: React.FC<GridScanProps> = ({
  linesColor = '#334155',
  scanColor = '#38bdf8',
  cells = 8,
  depth = 3,
  scanDuration = 2.4,
  clickEffect = 'ping',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pings, setPings] = useState<Ping[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickEffect === 'none' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newPing: Ping = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setPings(prev => [...prev.slice(-4), newPing]);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`absolute inset-0 overflow-hidden pointer-events-auto cursor-crosshair select-none ${className}`}
    >
      {/* 1. Perspective Grid Surface */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${linesColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${linesColor} 1px, transparent 1px)
          `,
          backgroundSize: `${100 / cells}% ${100 / cells}%`,
          transform: `perspective(600px) rotateX(25deg) scale(${1 + depth * 0.1})`,
          transformOrigin: 'top center',
        }}
      />

      {/* 2. Sweeping Radar Beam */}
      <motion.div
        animate={{ y: ['-10%', '110%'] }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: scanDuration,
          ease: 'linear',
        }}
        style={{
          background: `linear-gradient(to bottom, transparent, ${scanColor}22 70%, ${scanColor} 100%)`,
          boxShadow: `0 4px 20px ${scanColor}44`,
        }}
        className="absolute left-0 right-0 h-28 pointer-events-none opacity-80"
      />

      {/* 3. Interactive Sonar Pings on Click */}
      <AnimatePresence>
        {pings.map(p => (
          <motion.div
            key={p.id}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              left: p.x - 30,
              top: p.y - 30,
              borderColor: scanColor,
              boxShadow: `0 0 15px ${scanColor}`,
            }}
            className="absolute w-16 h-16 rounded-full border-2 pointer-events-none"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GridScan;
