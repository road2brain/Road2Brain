import React, { useState, useEffect } from 'react';
import { Map, Layers, Users, ExternalLink, Sparkles } from 'lucide-react';
import { fetchRoadmaps } from '@/services/roadmaps.service';
import { Roadmap } from '@/types';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export const AdminRoadmaps: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmaps().then(setRoadmaps).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Career Roadmap Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect 4-year engineering curriculum tracks and milestone sequences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roadmaps.map(roadmap => {
          const milestones = roadmap.milestones || [];
          return (
            <Card key={roadmap.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="primary">{roadmap.category}</Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    {milestones.length} Milestones
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{roadmap.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {roadmap.description}
                </p>

                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Target Roles
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {roadmap.targetRoles.map((r, i) => (
                      <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-xs font-semibold text-emerald-700">Published Live</span>
                <Link to={`/roadmaps/${roadmap.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="text-xs" rightIcon={<ExternalLink className="w-3 h-3" />}>
                    View Timeline
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
