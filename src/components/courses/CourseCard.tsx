import React from 'react';
import { ExternalLink, Bookmark as BookmarkIcon, Award, Clock, CheckCircle2 } from 'lucide-react';
import { Course } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useBookmarks';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { isSaved, toggleBookmark } = useBookmarks();
  const saved = isSaved(course.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleBookmark(course.id, 'course');
  };

  return (
    <Card className="flex flex-col justify-between h-full group hover:border-brand-teal/40">
      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="info">{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl transition-all duration-200 ${
              saved
                ? 'bg-blue-50 text-brand-blue'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label={saved ? 'Remove saved course' : 'Save course'}
            title={saved ? 'Saved in dashboard' : 'Save course'}
          >
            <BookmarkIcon className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & Provider */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-1">
          {course.title}
        </h3>
        <p className="text-xs font-semibold text-slate-500 mb-4">{course.provider}</p>

        {/* Meta Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          {course.priceType === 'free' ? (
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              100% Free
            </span>
          ) : (
            <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {formatCurrency(course.price, course.currency)}
            </span>
          )}

          {course.durationHours && (
            <span className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
              <Clock className="w-3 h-3 text-slate-400" />
              ~{course.durationHours} hours
            </span>
          )}

          {course.certificateAvailable && (
            <span className="flex items-center gap-1 text-brand-teal bg-teal-50 px-2 py-1 rounded-lg border border-teal-200/60 font-medium">
              <Award className="w-3 h-3 text-brand-teal" />
              Certificate
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & External Link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-400">
          Price verified: {formatDate(course.priceVerifiedAt)}
        </span>

        <a
          href={course.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition-colors"
        >
          View Course <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
