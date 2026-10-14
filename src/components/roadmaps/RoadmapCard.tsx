import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers, Users } from 'lucide-react';
import { Roadmap } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

interface RoadmapCardProps {
  roadmap: Roadmap;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
  const milestoneCount = roadmap.milestones?.length || 0;

  return (
    <Card className="flex flex-col justify-between h-full group hover:border-brand-violet/40">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="primary" className="bg-violet-50 text-brand-violet border-violet-200">
            {roadmap.category}
          </Badge>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {milestoneCount} Milestones
          </span>
        </div>

        <Link to={`/roadmaps/${roadmap.slug}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-violet transition-colors mb-2">
            {roadmap.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {roadmap.description}
        </p>

        {/* Target Roles */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Users className="w-3 h-3" /> Target Career Roles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {roadmap.targetRoles.map((role, idx) => (
              <span
                key={idx}
                className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-500 font-medium">
          4-Year Engineering Track
        </span>

        <Link to={`/roadmaps/${roadmap.slug}`}>
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Explore Timeline
          </Button>
        </Link>
      </div>
    </Card>
  );
};
