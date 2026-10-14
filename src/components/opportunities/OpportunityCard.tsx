import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bookmark as BookmarkIcon, ExternalLink, ArrowRight, Building, Clock } from 'lucide-react';
import { Opportunity } from '@/types';
import { Card } from '@/components/common/Card';
import { OpportunityTypeBadge, VerificationBadge, LocationBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { formatDate, formatCurrency, isExpired, isUpcomingDeadline, daysLeft } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onBookmarkChange?: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const { isSaved, toggleBookmark } = useBookmarks();
  const saved = isSaved(opportunity.id);
  const expired = isExpired(opportunity.deadline);
  const upcoming = isUpcomingDeadline(opportunity.deadline, 7);
  const remainingDays = daysLeft(opportunity.deadline);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(opportunity.id, 'opportunity');
  };

  return (
    <Card className="flex flex-col justify-between h-full group hover:border-brand-blue/40">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <OpportunityTypeBadge type={opportunity.type} />
            <VerificationBadge status={opportunity.verificationStatus} />
          </div>

          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-xl transition-all duration-200 ${
              saved
                ? 'bg-blue-50 text-brand-blue'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark opportunity'}
            title={saved ? 'Saved in your dashboard' : 'Save to dashboard'}
          >
            <BookmarkIcon className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title and Company */}
        <Link to={`/opportunities/${opportunity.slug}`} className="block group-hover:text-brand-blue transition-colors">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
            {opportunity.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mt-1.5 mb-3">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{opportunity.company}</span>
        </div>

        {/* Location & Stipend Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <LocationBadge type={opportunity.locationType} location={opportunity.location} />
          
          {(opportunity.stipendMin !== undefined || opportunity.stipendMax !== undefined) && (
            <span className="text-xs font-semibold text-slate-700 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-100">
              {opportunity.stipendMin === 0 && opportunity.stipendMax === 0 ? (
                'Free / Certificate'
              ) : opportunity.stipendMin && opportunity.stipendMax && opportunity.stipendMin !== opportunity.stipendMax ? (
                `${formatCurrency(opportunity.stipendMin, opportunity.currency)} - ${formatCurrency(opportunity.stipendMax, opportunity.currency)}`
              ) : (
                `${formatCurrency(opportunity.stipendMax || opportunity.stipendMin, opportunity.currency)}/mo`
              )}
            </span>
          )}
        </div>

        {/* Skills pills */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {opportunity.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {opportunity.skills.length > 4 && (
              <span className="text-[11px] font-medium text-slate-400 self-center">
                +{opportunity.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info: Deadline & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className={`w-3.5 h-3.5 ${expired ? 'text-rose-500' : upcoming ? 'text-amber-500' : 'text-slate-400'}`} />
          {expired ? (
            <span className="font-semibold text-rose-600">Application Closed</span>
          ) : upcoming ? (
            <span className="font-semibold text-amber-600">{remainingDays} days left</span>
          ) : (
            <span className="text-slate-500">Apply by {formatDate(opportunity.deadline)}</span>
          )}
        </div>

        <Link to={`/opportunities/${opportunity.slug}`}>
          <Button variant="ghost" size="sm" className="text-brand-blue hover:text-blue-700 font-semibold p-1">
            Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
