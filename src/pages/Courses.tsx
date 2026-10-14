import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { CourseCard } from '@/components/courses/CourseCard';
import { CardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { fetchCourses, CourseFilterOptions } from '@/services/courses.service';
import { Course } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

export const Courses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialLevel = searchParams.get('level') || 'all';
  const initialPriceType = searchParams.get('priceType') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState<CourseFilterOptions>({
    category: initialCategory,
    level: initialLevel as any,
    priceType: initialPriceType as any,
    search: initialSearch,
    certificateOnly: false,
  });

  const debouncedSearch = useDebounce(filters.search || '', 300);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.level && filters.level !== 'all') params.level = filters.level;
    if (filters.priceType && filters.priceType !== 'all') params.priceType = filters.priceType;
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    fetchCourses({
      ...filters,
      search: debouncedSearch,
    })
      .then((data) => {
        setCourses(data);
        setPage(1);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.category, filters.level, filters.priceType, filters.certificateOnly]);

  const handleReset = () => {
    setFilters({
      category: 'all',
      level: 'all',
      priceType: 'all',
      search: '',
      certificateOnly: false,
    });
  };

  const totalItems = courses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedCourses = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return courses.slice(start, start + itemsPerPage);
  }, [courses, page, itemsPerPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" /> Academic & Professional Curriculum
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Curated Free & Affordable Courses
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          High-yield technical coursework from world-class universities and creators (Harvard, MIT, DeepLearning.AI, freeCodeCamp) with verified certificate information.
        </p>
      </div>

      <CourseFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
        totalResults={totalItems}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : displayedCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
              >
                Previous
              </Button>
              <span className="text-xs font-semibold px-2 text-slate-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => {
                  setPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No courses found"
          description="Try selecting 'All Categories' or clearing your search term."
          actionText="Reset Course Filters"
          onAction={handleReset}
        />
      )}
    </div>
  );
};
