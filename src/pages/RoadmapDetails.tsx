import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Map, Users, Layers, AlertCircle, Share2 } from 'lucide-react';
import { fetchRoadmapBySlug } from '@/services/roadmaps.service';
import { Roadmap } from '@/types';
import { RoadmapTimeline } from '@/components/roadmaps/RoadmapTimeline';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { useToast } from '@/contexts/ToastContext';

export const RoadmapDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchRoadmapBySlug(slug)
      .then(setRoadmap)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Roadmap link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 border-4 border-brand-violet border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-slate-500">Loading roadmap timeline...</p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Roadmap Not Found</h2>
        <p className="text-xs text-slate-600 mb-6">
          The requested career roadmap could not be found.
        </p>
        <Link to="/roadmaps">
          <Button variant="primary">Browse All Roadmaps</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/roadmaps" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-violet transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all roadmaps
        </Link>

        <Button variant="outline" size="sm" onClick={handleShare} leftIcon={<Share2 className="w-3.5 h-3.5" />}>
          Share Roadmap
        </Button>
      </div>

      {/* Roadmap Header Card */}
      <Card className="p-6 sm:p-8 mb-8 border-brand-violet/20">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary" className="bg-violet-50 text-brand-violet border-violet-200">
            {roadmap.category}
          </Badge>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            {roadmap.milestones?.length || 0} Total Milestones
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy mb-3 tracking-tight">
          {roadmap.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
          {roadmap.description}
        </p>

        {/* Target Roles & Target Branches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Target Career Roles
            </span>
            <div className="flex flex-wrap gap-1.5">
              {roadmap.targetRoles.map((r, i) => (
                <span key={i} className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Recommended Academic Branches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {roadmap.targetBranches.map((b, i) => (
                <span key={i} className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Milestone Timeline */}
      <RoadmapTimeline roadmap={roadmap} />
    </div>
  );
};
