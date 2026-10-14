import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';
import { OpportunityFilters, FilterState } from '@/components/opportunities/OpportunityFilters';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { CardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { fetchOpportunities } from '@/services/opportunities.service';
import { Opportunity } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

export const Opportunities: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters
  const initialType = searchParams.get('type') || 'all';
  const initialYear = searchParams.get('year') || 'all';
  const initialLocation = searchParams.get('location') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = (searchParams.get('sort') as 'newest' | 'deadline') || 'newest';

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    type: initialType,
    academicYear: initialYear,
    locationType: initialLocation,
    sortBy: initialSort,
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // Sync state to URL search parameters
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.type !== 'all') params.type = filters.type;
    if (filters.academicYear !== 'all') params.year = filters.academicYear;
    if (filters.locationType !== 'all') params.location = filters.locationType;
    if (filters.sortBy !== 'newest') params.sort = filters.sortBy;
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch opportunities whenever filters change
  useEffect(() => {
    setLoading(true);
    fetchOpportunities({
      search: debouncedSearch,
      type: filters.type,
      academicYear: filters.academicYear,
      locationType: filters.locationType,
      sortBy: filters.sortBy,
    })
      .then((data) => {
        setOpportunities(data);
        setPage(1);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.type, filters.academicYear, filters.locationType, filters.sortBy]);

  const handleReset = () => {
    setFilters({
      search: '',
      type: 'all',
      academicYear: 'all',
      locationType: 'all',
      sortBy: 'newest',
    });
  };

  // Pagination calculation
  const totalItems = opportunities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedOpportunities = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return opportunities.slice(start, start + itemsPerPage);
  }, [opportunities, page, itemsPerPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Page Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" /> Real-time Opportunity Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
          Verified Student Opportunities
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Direct official links for high-impact software internships, fresher campus drives, national hackathons, scholarships, and student leadership programs.
        </p>
      </div>

      {/* Filter Component with URL Sync */}
      <OpportunityFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleReset}
        totalResults={totalItems}
      />

      {/* Grid or Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : displayedOpportunities.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1 text-xs font-semibold px-2 text-slate-600">
                Page {page} of {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
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
          title="No verified opportunities match your filters"
          description="Try broadening your search keyword, selecting 'All Academic Years', or clearing the work mode filter."
          actionText="Reset All Filters"
          onAction={handleReset}
        />
      )}
    </div>
  );
};
