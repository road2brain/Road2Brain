import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { Roadmap, Milestone } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

interface RoadmapProgressCardProps {
  roadmap: Roadmap | null;
  completedMilestoneIds: string[];
  nextMilestone: Milestone | null;
}

export const RoadmapProgressCard: React.FC<RoadmapProgressCardProps> = ({
  roadmap,
  completedMilestoneIds,
  nextMilestone,
}) => {
  if (!roadmap) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-brand-violet flex items-center justify-center">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Career Roadmap</h3>
            <p className="text-xs text-slate-500">No active roadmap selected yet</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Select a 4-year engineering roadmap (SDE, AI/ML, or Data Analytics) to track your milestones, project ideas, and interview prep.
        </p>
        <Link to="/roadmaps">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Explore Roadmaps
          </Button>
        </Link>
      </Card>
    );
  }

  const milestones = roadmap.milestones || [];
  const completedCount = completedMilestoneIds.length;
  const percentage = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-brand-violet flex items-center justify-center">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{roadmap.title}</h3>
            <p className="text-xs text-slate-500">
              {completedCount} of {milestones.length} milestones finished
            </p>
          </div>
        </div>

        <span className="text-xl font-black text-brand-violet">{percentage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-brand-violet to-brand-blue rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Next Milestone Box */}
      {nextMilestone ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold text-brand-violet uppercase tracking-wider text-[10px]">
              Current Incomplete Step
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> ~{nextMilestone.estimatedHours} hrs
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">{nextMilestone.title}</h4>
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {nextMilestone.description}
          </p>
          
          <Link to={`/roadmaps/${roadmap.slug}`}>
            <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<PlayCircle className="w-3.5 h-3.5 text-brand-blue" />}>
              Open Step Details
            </Button>
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
          <p className="text-sm font-bold text-emerald-900">All milestones completed!</p>
          <p className="text-xs text-emerald-700">Incredible achievement. You are well prepared for campus placements.</p>
        </div>
      )}

      <div className="text-right">
        <Link to={`/roadmaps/${roadmap.slug}`}>
          <Button variant="ghost" size="sm" className="text-xs font-semibold text-brand-violet p-0">
            View full roadmap <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
