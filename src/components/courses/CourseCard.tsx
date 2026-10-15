import React from 'react';
import { ExternalLink, Bookmark as BookmarkIcon, Award, Clock, GraduationCap } from 'lucide-react';
import { Course } from '@/types';
import { Card } from '@/components/common/Card';
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
    <Card 
      spotlight
      spotlightColor="rgba(20, 184, 166, 0.08)"
      borderColor="rgba(20, 184, 166, 0.35)"
      className="flex flex-col justify-between h-full group hover:border-brand-teal/50 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden bg-white"
    >
      {/* Top accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-teal to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" />

      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/70">
              {course.category}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
              {course.level}
            </span>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl transition-all duration-200 ${
              saved
                ? 'bg-blue-50 text-brand-blue ring-1 ring-blue-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label={saved ? 'Remove saved course' : 'Save course'}
            title={saved ? 'Saved in dashboard' : 'Save course'}
          >
            <BookmarkIcon className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & Provider */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-1.5 leading-snug">
          {course.title}
        </h3>
        <p className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
          <span>{course.provider}</span>
        </p>

        {/* Meta Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          {course.priceType === 'free' ? (
            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              100% Free
            </span>
          ) : (
            <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {formatCurrency(course.price, course.currency)}
            </span>
          )}

          {course.durationHours && (
            <span className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              ~{course.durationHours} hrs
            </span>
          )}

          {course.certificateAvailable && (
            <span className="flex items-center gap-1 text-brand-teal bg-teal-50 px-2 py-1 rounded-lg border border-teal-200/60 font-semibold text-[11px]">
              <Award className="w-3.5 h-3.5 text-brand-teal" />
              Certificate
            </span>
          )}
        </div>
      </div>

      {/* Footer Info & Official Link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-400 font-medium">
          Price checked: {formatDate(course.priceVerifiedAt)}
        </span>

        <a
          href={course.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all"
        >
          View Course <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
