import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, UserCheck, GraduationCap, Compass } from 'lucide-react';
import { UserProfile } from '@/types';
import { Button } from '@/components/common/Button';

interface WelcomeBannerProps {
  profile: UserProfile | null;
  nextMilestoneTitle?: string;
  roadmapSlug?: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  profile,
  nextMilestoneTitle,
  roadmapSlug,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy p-6 sm:p-8 text-white shadow-elevated mb-8 border border-slate-800">
      {/* Background accents */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-32 -top-10 w-48 h-48 bg-brand-teal/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-teal border border-white/10">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>
              {profile?.currentYear || 'Engineering Student'} • {profile?.branch || 'CSE'}
              {profile?.collegeName ? ` • ${profile.collegeName}` : ''}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.displayName || 'Student'}!
          </h1>

          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Target Track:{' '}
            <span className="font-semibold text-white">
              {profile?.targetCareerTrack || 'Software Development Engineer'}
            </span>
            . Stay consistent with your daily learning milestones and keep your opportunities bookmarked.
          </p>
        </div>

        {/* Clear Next Action Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shrink-0 max-w-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-teal mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Next Recommended Action
          </p>
          <p className="text-sm font-semibold text-white mb-3 line-clamp-2">
            {nextMilestoneTitle || 'Select your career roadmap to start tracking milestones'}
          </p>
          
          <Link to={roadmapSlug ? `/roadmaps/${roadmapSlug}` : '/roadmaps'}>
            <Button size="sm" variant="primary" className="w-full bg-brand-blue hover:bg-blue-600" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              {roadmapSlug ? 'Continue Learning' : 'Choose Roadmap'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
