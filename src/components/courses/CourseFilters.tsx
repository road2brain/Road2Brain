import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { CourseFilterOptions } from '@/services/courses.service';

interface CourseFiltersProps {
  filters: CourseFilterOptions;
  onChange: (updated: CourseFilterOptions) => void;
  onReset: () => void;
  totalResults: number;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const isFiltered = Boolean(
    filters.search || 
    (filters.category && filters.category !== 'all') || 
    (filters.level && filters.level !== 'all') || 
    (filters.priceType && filters.priceType !== 'all') || 
    filters.certificateOnly
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card mb-8">
      {/* Search Input */}
      <div className="mb-4">
        <Input
          placeholder="Search courses by topic, tech (e.g. DSA, Python, PyTorch, React, SQL), or provider..."
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          className="bg-slate-50 border-slate-200 focus:bg-white"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Category */}
        <Select
          value={filters.category || 'all'}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          options={[
            { value: 'all', label: 'All Categories' },
            { value: 'Computer Science Fundamentals', label: 'CS Fundamentals' },
            { value: 'DSA', label: 'Data Structures & Algorithms' },
            { value: 'Web Development', label: 'Full Stack & Web Dev' },
            { value: 'AI/ML', label: 'AI & Machine Learning' },
            { value: 'Cloud', label: 'Cloud Computing' },
            { value: 'Data Analytics', label: 'Data Analytics & SQL' },
            { value: 'Cybersecurity', label: 'Cybersecurity' },
          ]}
        />

        {/* Level */}
        <Select
          value={filters.level || 'all'}
          onChange={(e) => onChange({ ...filters, level: e.target.value as any })}
          options={[
            { value: 'all', label: 'All Difficulty Levels' },
            { value: 'Beginner', label: 'Beginner Friendly' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Advanced', label: 'Advanced' },
          ]}
        />

        {/* Pricing */}
        <Select
          value={filters.priceType || 'all'}
          onChange={(e) => onChange({ ...filters, priceType: e.target.value as any })}
          options={[
            { value: 'all', label: 'All Pricing Models' },
            { value: 'free', label: '100% Free Only' },
            { value: 'paid', label: 'Paid / Certification Fee' },
          ]}
        />

        {/* Certificate toggle button */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 w-full select-none">
            <input
              type="checkbox"
              checked={Boolean(filters.certificateOnly)}
              onChange={(e) => onChange({ ...filters, certificateOnly: e.target.checked })}
              className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue w-4 h-4"
            />
            <span>With Verified Certificate</span>
          </label>
        </div>
      </div>

      {/* Filter status row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">
          Showing <span className="text-brand-blue font-bold">{totalResults}</span> curated courses
        </span>

        {isFiltered && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-brand-blue hover:text-blue-800 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset course filters
          </button>
        )}
      </div>
    </div>
  );
};
