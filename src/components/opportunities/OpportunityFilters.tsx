import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Button } from '@/components/common/Button';

export interface FilterState {
  search: string;
  type: string;
  academicYear: string;
  locationType: string;
  sortBy: 'newest' | 'deadline';
}

interface OpportunityFiltersProps {
  filters: FilterState;
  onChange: (updated: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const isFiltered = Boolean(
    filters.search || 
    filters.type !== 'all' || 
    filters.academicYear !== 'all' || 
    filters.locationType !== 'all' || 
    filters.sortBy !== 'newest'
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card mb-8">
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Search by role, company (e.g. Google, SDE, Amazon WOW, SIH), or skill..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          className="bg-slate-50 border-slate-200 focus:bg-white"
        />
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Opportunity Type */}
        <Select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          options={[
            { value: 'all', label: 'All Opportunity Types' },
            { value: 'internship', label: 'Internships' },
            { value: 'fresher_job', label: 'Fresher Campus Jobs' },
            { value: 'hackathon', label: 'Hackathons' },
            { value: 'scholarship', label: 'Scholarships' },
            { value: 'student_program', label: 'Student Programs' },
          ]}
        />

        {/* Academic Year */}
        <Select
          value={filters.academicYear}
          onChange={(e) => onChange({ ...filters, academicYear: e.target.value })}
          options={[
            { value: 'all', label: 'All Academic Years' },
            { value: '1st Year', label: '1st Year (Freshers)' },
            { value: '2nd Year', label: '2nd Year (Sophomores)' },
            { value: '3rd Year', label: '3rd Year (Pre-final)' },
            { value: '4th Year', label: '4th Year (Final Year)' },
          ]}
        />

        {/* Location Type */}
        <Select
          value={filters.locationType}
          onChange={(e) => onChange({ ...filters, locationType: e.target.value })}
          options={[
            { value: 'all', label: 'All Work Modes' },
            { value: 'remote', label: 'Remote / Virtual' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'on-site', label: 'On-site' },
          ]}
        />

        {/* Sort By */}
        <Select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
          options={[
            { value: 'newest', label: 'Sort: Newest Added' },
            { value: 'deadline', label: 'Sort: Deadline Approaching' },
          ]}
        />
      </div>

      {/* Filter status row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">
          Showing <span className="text-brand-blue font-bold">{totalResults}</span> verified opportunities
        </span>

        {isFiltered && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-brand-blue hover:text-blue-800 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>
    </div>
  );
};
