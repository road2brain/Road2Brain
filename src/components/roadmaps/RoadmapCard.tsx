import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Users } from 'lucide-react';
import { Roadmap } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
  const milestoneCount = roadmap.milestones?.length || 0;

  const getTheme = (id: string) => {
    if (id.includes('aiml')) {
      return {
        accent: 'from-brand-teal via-blue-500 to-brand-violet',
        badge: 'bg-teal-50 text-brand-teal border-teal-200',
        iconBg: 'bg-teal-50 text-brand-teal',
        spotlight: 'rgba(20, 184, 166, 0.10)',
        border: 'rgba(20, 184, 166, 0.4)',
      };
    }
    if (id.includes('data')) {
      return {
        accent: 'from-amber-500 via-orange-500 to-rose-500',
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        iconBg: 'bg-amber-50 text-amber-700',
        spotlight: 'rgba(245, 158, 11, 0.10)',
        border: 'rgba(245, 158, 11, 0.4)',
      };
    }
    return {
      accent: 'from-brand-blue via-indigo-600 to-brand-violet',
      badge: 'bg-blue-50 text-brand-blue border-blue-200',
      iconBg: 'bg-blue-50 text-brand-blue',
      spotlight: 'rgba(37, 99, 235, 0.10)',
      border: 'rgba(37, 99, 235, 0.4)',
    };
  };

  const theme = getTheme(roadmap.id);

  return (
    <Card 
      tilt
      maxTilt={6}
      scale={1.015}
      spotlightColor={theme.spotlight}
      borderColor={theme.border}
      className="flex flex-col justify-between h-full group hover:border-slate-300 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden bg-white"
    >
      {/* Top accent gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.accent} z-20 pointer-events-none`} />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4 pt-1">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${theme.badge}`}>
            {roadmap.category}
          </span>
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {milestoneCount} Milestones
          </span>
        </div>

        {/* Title */}
        <Link to={`/roadmaps/${roadmap.slug}`}>
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-blue transition-colors mb-2.5 tracking-tight">
            {roadmap.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed font-normal">
          {roadmap.description}
        </p>

        {/* Target Roles */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" /> Target Roles & Career Paths
          </p>
          <div className="flex flex-wrap gap-1.5">
            {roadmap.targetRoles.map((role, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/80"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-400 font-semibold">
          1st to 4th Year Track
        </span>

        <Link to={`/roadmaps/${roadmap.slug}`}>
          <Button variant="outline" size="sm" className="font-bold text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />}>
            View Roadmap
          </Button>
        </Link>
      </div>
    </Card>
  );
};
