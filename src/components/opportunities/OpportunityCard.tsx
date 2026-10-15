import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark as BookmarkIcon, ArrowRight, Clock } from 'lucide-react';
import { Opportunity } from '@/types';
import { Card } from '@/components/common/Card';
import { OpportunityTypeBadge, VerificationBadge, LocationBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { PulseHeart } from '@/components/reactbits/PulseHeart';
import { formatDate, formatCurrency, isExpired, isUpcomingDeadline, daysLeft } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onBookmarkChange?: () => void;
}

// Generate consistent brand color tint for company initials emblem
function getCompanyInitials(name: string): { initials: string; bg: string; text: string } {
  if (!name) return { initials: 'CO', bg: 'bg-slate-100', text: 'text-slate-700' };
  const words = name.trim().split(/\s+/);
  const initials = words.length >= 2 
    ? (words[0][0] + words[1][0]).toUpperCase() 
    : name.substring(0, 2).toUpperCase();

  const lower = name.toLowerCase();
  if (lower.includes('google')) return { initials, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600' };
  if (lower.includes('amazon')) return { initials, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' };
  if (lower.includes('microsoft')) return { initials, bg: 'bg-sky-50 border-sky-200', text: 'text-sky-600' };
  if (lower.includes('flipkart')) return { initials, bg: 'bg-yellow-50 border-yellow-300', text: 'text-yellow-700' };
  if (lower.includes('adobe')) return { initials, bg: 'bg-rose-50 border-rose-200', text: 'text-rose-600' };
  if (lower.includes('isro') || lower.includes('drdo')) return { initials, bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' };
  if (lower.includes('cisco')) return { initials, bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' };
  if (lower.includes('uber')) return { initials, bg: 'bg-slate-900 border-slate-700', text: 'text-white' };

  return { initials, bg: 'bg-slate-100 border-slate-200', text: 'text-slate-700' };
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const { isSaved, toggleBookmark } = useBookmarks();
  const saved = isSaved(opportunity.id);
  const expired = isExpired(opportunity.deadline);
  const upcoming = isUpcomingDeadline(opportunity.deadline, 7);
  const remainingDays = daysLeft(opportunity.deadline);
  const { initials, bg, text } = getCompanyInitials(opportunity.company);

  // Deterministic seed count for live student likes
  const initialLikes = Math.floor(
    (opportunity.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 11) % 480 + 35
  );

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(opportunity.id, 'opportunity');
  };

  return (
    <Card 
      spotlight
      spotlightColor="rgba(37, 99, 235, 0.08)"
      borderColor="rgba(37, 99, 235, 0.35)"
      className="flex flex-col justify-between h-full group hover:border-brand-blue/50 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden bg-white"
    >
      {/* Subtle top accent gradient line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-brand-teal to-brand-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />

      <div>
        {/* Top Bar: Company Monogram + Category + PulseHeart + Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 shadow-xs transition-transform group-hover:scale-105 ${bg} ${text}`}>
              {initials}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate block">
                {opportunity.company}
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate block">
                {opportunity.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* React Bits PulseHeart Like Feature */}
            <PulseHeart
              count={initialLikes}
              size={32}
              corner={12}
              likedColor="#ff4d6d"
              idleColor="#94a3b8"
              pillColor="#F8FAFC"
              textColor="#334155"
            />

            <button
              onClick={handleBookmarkClick}
              className={`p-1.5 rounded-xl transition-all duration-200 shrink-0 ${
                saved
                  ? 'bg-blue-50 text-brand-blue ring-1 ring-blue-200'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              aria-label={saved ? 'Remove bookmark' : 'Bookmark opportunity'}
              title={saved ? 'Saved in your dashboard' : 'Save to dashboard'}
            >
              <BookmarkIcon className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link to={`/opportunities/${opportunity.slug}`} className="block group-hover:text-brand-blue transition-colors mb-3">
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
            {opportunity.title}
          </h3>
        </Link>

        {/* Badges row: Type + Verification + Work mode */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <OpportunityTypeBadge type={opportunity.type} />
          <VerificationBadge status={opportunity.verificationStatus} />
          <LocationBadge type={opportunity.locationType} location={opportunity.location} />
        </div>

        {/* Stipend / Value pill */}
        {(opportunity.stipendMin !== undefined || opportunity.stipendMax !== undefined) && (
          <div className="mb-3.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-subtle" />
              {opportunity.stipendMin === 0 && opportunity.stipendMax === 0 ? (
                'Free / Official Program'
              ) : opportunity.stipendMin && opportunity.stipendMax && opportunity.stipendMin !== opportunity.stipendMax ? (
                `${formatCurrency(opportunity.stipendMin, opportunity.currency)} - ${formatCurrency(opportunity.stipendMax, opportunity.currency)}`
              ) : (
                `${formatCurrency(opportunity.stipendMax || opportunity.stipendMin, opportunity.currency)}/mo`
              )}
            </span>
          </div>
        )}

        {/* Skills pills */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {opportunity.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-600 bg-slate-100/90 hover:bg-slate-200/70 px-2 py-0.5 rounded-md transition-colors"
              >
                {skill}
              </span>
            ))}
            {opportunity.skills.length > 3 && (
              <span className="text-[10px] font-semibold text-slate-400 self-center">
                +{opportunity.skills.length - 3}
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
            <span className="font-bold text-rose-600">Closed</span>
          ) : upcoming ? (
            <span className="font-bold text-amber-600">{remainingDays}d left</span>
          ) : (
            <span className="text-slate-500 font-medium">{formatDate(opportunity.deadline)}</span>
          )}
        </div>

        <Link to={`/opportunities/${opportunity.slug}`}>
          <Button variant="ghost" size="sm" className="text-brand-blue group-hover:bg-blue-50 font-bold p-1 px-2 text-xs rounded-lg">
            Details <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
