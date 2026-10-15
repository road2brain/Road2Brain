import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Sparkles, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
      {/* Hero Showcase Banner with Background Imagery */}
      <div className="relative rounded-3xl overflow-hidden mb-10 border border-slate-200/80 shadow-xl bg-slate-950 text-white">
        {/* Background Image layer with subtle zoom animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/images/internship-student.jpg"
            alt="Verified Student Opportunities"
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 filter blur-[0.5px]"
          />
          {/* Multi-gradient backdrop to ensure 100% text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-brand-navy/80" />
        </div>

        <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-subtle" />
            <Compass className="w-3.5 h-3.5" />
            Real-Time Verified Opportunity Directory
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Launch Your Career With <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-brand-blue">
              Direct Official Openings
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Every software internship, national hackathon, fresher campus drive, and scholarship is hand-verified directly from official corporate career portals and ministry notices.
          </p>

          {/* Trust Highlights */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Official Links</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Zero Fake Listings & Scams</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-cyan-300" />
              <span>{totalItems} Opportunities Available</span>
            </div>
          </div>
        </div>
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
