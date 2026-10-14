import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { Opportunity, Bookmark } from '@/types';
import { Card } from '@/components/common/Card';
import { formatDate, isUpcomingDeadline, daysLeft, isExpired } from '@/lib/utils';

interface UpcomingDeadlinesProps {
  bookmarks: Bookmark[];
  allOpportunities: Opportunity[];
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  bookmarks,
  allOpportunities,
}) => {
  const savedOppIds = bookmarks.filter(b => b.itemType === 'opportunity').map(b => b.itemId);
  
  // Find saved opportunities closing within 14 days and not yet expired
  const closingSoon = allOpportunities
    .filter(o => savedOppIds.includes(o.id) && !isExpired(o.deadline) && isUpcomingDeadline(o.deadline, 14))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  if (closingSoon.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-8">
      <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Upcoming Saved Deadlines ({closingSoon.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {closingSoon.map(opp => {
          const days = daysLeft(opp.deadline);
          return (
            <Link
              key={opp.id}
              to={`/opportunities/${opp.slug}`}
              className="bg-white p-3 rounded-xl border border-amber-200/60 shadow-xs hover:border-amber-400 transition-colors block"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{opp.title}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
                  {days === 0 ? 'Today' : `${days}d left`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{opp.company} • Apply by {formatDate(opp.deadline)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
