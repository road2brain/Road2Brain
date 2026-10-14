import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { Opportunity, Course, Bookmark as BookmarkType } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatDate } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';

interface SavedItemsListProps {
  bookmarks: BookmarkType[];
  allOpportunities: Opportunity[];
  allCourses: Course[];
}

export const SavedItemsList: React.FC<SavedItemsListProps> = ({
  bookmarks,
  allOpportunities,
  allCourses,
}) => {
  const [tab, setTab] = useState<'opportunities' | 'courses'>('opportunities');
  const { toggleBookmark } = useBookmarks();

  const savedOppIds = bookmarks.filter(b => b.itemType === 'opportunity').map(b => b.itemId);
  const savedCourseIds = bookmarks.filter(b => b.itemType === 'course').map(b => b.itemId);

  const savedOpps = allOpportunities.filter(o => savedOppIds.includes(o.id));
  const savedCourses = allCourses.filter(c => savedCourseIds.includes(c.id));

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-brand-blue" />
          <h2 className="text-lg font-bold text-slate-900">Saved Items</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {bookmarks.length}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTab('opportunities')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              tab === 'opportunities'
                ? 'bg-white text-brand-blue shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Opportunities ({savedOpps.length})
          </button>
          <button
            onClick={() => setTab('courses')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              tab === 'courses'
                ? 'bg-white text-brand-blue shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Courses ({savedCourses.length})
          </button>
        </div>
      </div>

      {tab === 'opportunities' ? (
        savedOpps.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {savedOpps.map(opp => (
              <div key={opp.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <Link to={`/opportunities/${opp.slug}`} className="text-sm font-bold text-slate-900 hover:text-brand-blue truncate block">
                    {opp.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-700">{opp.company}</span>
                    <span>•</span>
                    <span>Deadline: {formatDate(opp.deadline)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/opportunities/${opp.slug}`}>
                    <Button variant="ghost" size="sm" className="text-xs text-brand-blue">
                      View
                    </Button>
                  </Link>
                  <button
                    onClick={() => toggleBookmark(opp.id, 'opportunity')}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No saved opportunities yet</p>
            <p className="text-[11px] text-slate-400 mb-3">Browse verified internships and jobs to save them here.</p>
            <Link to="/opportunities">
              <Button variant="outline" size="sm">Browse Opportunities</Button>
            </Link>
          </div>
        )
      ) : (
        savedCourses.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {savedCourses.map(course => (
              <div key={course.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <a href={course.officialUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-900 hover:text-brand-blue truncate block">
                    {course.title}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-700">{course.provider}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{course.priceType === 'free' ? 'Free' : 'Paid'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a href={course.officialUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="text-xs text-brand-blue" rightIcon={<ExternalLink className="w-3 h-3" />}>
                      Open
                    </Button>
                  </a>
                  <button
                    onClick={() => toggleBookmark(course.id, 'course')}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                    aria-label="Remove course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No saved courses yet</p>
            <p className="text-[11px] text-slate-400 mb-3">Save top curated courses to access them quickly.</p>
            <Link to="/courses">
              <Button variant="outline" size="sm">Browse Courses</Button>
            </Link>
          </div>
        )
      )}
    </Card>
  );
};
