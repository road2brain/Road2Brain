import React, { useState, useEffect } from 'react';
import { Map, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';
import { RoadmapCard } from '@/components/roadmaps/RoadmapCard';
import { fetchRoadmaps } from '@/services/roadmaps.service';
import { Roadmap } from '@/types';
import { CardSkeleton } from '@/components/common/Skeleton';

export const Roadmaps: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmaps()
      .then(setRoadmaps)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-violet uppercase tracking-wider mb-2">
          <Map className="w-4 h-4" /> 4-Year Technical Guidance
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
          Engineering Career Roadmaps
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          Structured year-by-year learning paths designed for B.Tech CSE/IT students. Learn core computer science fundamentals, complete real-world projects, and prepare for placement rounds without confusion.
        </p>

        {/* Disclaimer per Section 5 */}
        <p className="text-xs text-slate-400 mt-3 italic">
          Note: Following these roadmaps does not guarantee employment. They provide a structured, industry-aligned technical curriculum to maximize your engineering competence.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {roadmaps.map((rm) => (
            <RoadmapCard key={rm.id} roadmap={rm} />
          ))}
        </div>
      )}

      {/* Year-by-Year Strategic Overview */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-card max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-navy">How Our 4-Year Framework Works</h2>
          <p className="text-xs text-slate-500 mt-1">Structured across 8 academic semesters to keep engineering students ahead</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-xs font-extrabold text-brand-blue uppercase tracking-wider block mb-1">
              1st Year • Foundations
            </span>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Language & Problem Solving</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Master C++ or Java syntax, time complexity, and basic data structures (arrays, strings, recursion).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100">
            <span className="text-xs font-extrabold text-brand-violet uppercase tracking-wider block mb-1">
              2nd Year • Development
            </span>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Full Stack & Advanced DSA</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trees, graphs, dynamic programming, web development, REST APIs, databases, and summer internship drives (Amazon WOW, Flipkart Runway).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
            <span className="text-xs font-extrabold text-brand-teal uppercase tracking-wider block mb-1">
              3rd Year • Specialization
            </span>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Systems, Cloud & Pre-Final Interns</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Low-Level Design (LLD), System Design (HLD), Docker, AWS, open source contributions (GSoC), and high-paying summer internships.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block mb-1">
              4th Year • Placements
            </span>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Campus Hiring & Capstones</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Core CS theory (OS, DBMS, Networks), mock interviews, ATS resume polish, and Day-1/Day-2 placement execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
