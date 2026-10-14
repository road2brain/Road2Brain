import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  FolderGit2, 
  Sparkles,
  BookmarkCheck
} from 'lucide-react';
import { Roadmap, Milestone, AcademicYear } from '@/types';
import { useRoadmapProgress } from '@/hooks/useRoadmapProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

interface RoadmapTimelineProps {
  roadmap: Roadmap;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ roadmap }) => {
  const { isCompleted, toggleMilestone } = useRoadmapProgress(roadmap.id);
  const { currentUser, profile, updateStudentProfile } = useAuth();
  const { showToast } = useToast();
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  const milestones = roadmap.milestones || [];
  const completedCount = milestones.filter(m => isCompleted(m.id)).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
  const isSelectedTrack = profile?.selectedRoadmapId === roadmap.id;

  const toggleExpand = (id: string) => {
    setExpandedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectTrack = async () => {
    if (!currentUser) {
      showToast('Please sign in to set this roadmap as your active career track.', 'info');
      return;
    }
    try {
      await updateStudentProfile({
        selectedRoadmapId: roadmap.id,
        targetCareerTrack: roadmap.title,
      });
      showToast(`${roadmap.title} set as your primary career track!`, 'success', 'Track Activated');
    } catch {
      showToast('Could not update active track.', 'error');
    }
  };

  // Group milestones by academic year
  const years: AcademicYear[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const milestonesByYear = years.reduce((acc, yr) => {
    acc[yr] = milestones.filter(m => m.year === yr);
    return acc;
  }, {} as Record<AcademicYear, Milestone[]>);

  return (
    <div className="space-y-8">
      {/* Progress & Track Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Milestone Progress</h2>
              {isSelectedTrack && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  <BookmarkCheck className="w-3.5 h-3.5" /> Active Track
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mark milestones as you finish coursework and projects. Your progress is saved automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isSelectedTrack && currentUser && (
              <Button variant="outline" size="sm" onClick={handleSelectTrack}>
                Set as My Active Track
              </Button>
            )}
            <div className="text-right">
              <span className="text-2xl font-black text-brand-blue">{progressPercent}%</span>
              <span className="text-xs text-slate-400 block font-medium">
                {completedCount} of {milestones.length} completed
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-blue to-brand-teal transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Year-by-Year Milestones */}
      <div className="space-y-10">
        {years.map((year, yearIndex) => {
          const yearMilestones = milestonesByYear[year];
          if (!yearMilestones || yearMilestones.length === 0) return null;

          const yearCompleted = yearMilestones.filter(m => isCompleted(m.id)).length;

          return (
            <div key={year} className="relative">
              {/* Year Heading */}
              <div className="sticky top-20 z-10 bg-slate-50/95 backdrop-blur-sm py-2 mb-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-brand-navy text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {yearIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{year}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {yearIndex === 0 && 'Foundations & Algorithmic Problem Solving'}
                      {yearIndex === 1 && 'Full Stack Architecture & Core Engineering'}
                      {yearIndex === 2 && 'Advanced Systems, Cloud & Internships'}
                      {yearIndex === 3 && 'Placement Interview Drives & Production Capstone'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {yearCompleted} / {yearMilestones.length} done
                </span>
              </div>

              {/* Milestones list with vertical connecting line */}
              <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {yearMilestones.map((milestone) => {
                  const completed = isCompleted(milestone.id);
                  const isExpanded = Boolean(expandedMilestones[milestone.id]);

                  return (
                    <div
                      key={milestone.id}
                      className={`relative bg-white rounded-2xl border transition-all duration-200 ${
                        completed
                          ? 'border-emerald-200/80 bg-emerald-50/15 shadow-xs'
                          : 'border-slate-200/90 shadow-card hover:border-slate-300'
                      }`}
                    >
                      {/* Node Bullet on Timeline */}
                      <button
                        onClick={() => toggleMilestone(roadmap.id, milestone.id)}
                        className={`absolute -left-9 sm:-left-11 top-5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          completed
                            ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-100'
                            : 'bg-white border-2 border-slate-300 text-transparent hover:border-brand-blue hover:text-slate-300'
                        }`}
                        aria-label={completed ? 'Mark incomplete' : 'Mark milestone complete'}
                        title={completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current text-white" />
                      </button>

                      {/* Header row */}
                      <div className="p-5 flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-400">
                              Step {milestone.order}
                            </span>
                            {milestone.isRequired ? (
                              <Badge variant="warning" size="sm">Core Milestone</Badge>
                            ) : (
                              <Badge variant="outline" size="sm">Optional Track</Badge>
                            )}
                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" /> ~{milestone.estimatedHours} hrs
                            </span>
                          </div>

                          <h4 
                            onClick={() => toggleExpand(milestone.id)} 
                            className={`text-base font-bold cursor-pointer transition-colors ${
                              completed ? 'text-emerald-950 line-through opacity-75' : 'text-slate-900 hover:text-brand-blue'
                            }`}
                          >
                            {milestone.title}
                          </h4>

                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {milestone.description}
                          </p>

                          {/* Skill Tags */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {milestone.skillTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Toggle action */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toggleMilestone(roadmap.id, milestone.id)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                              completed
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            {completed ? 'Completed' : 'Mark Done'}
                          </button>

                          <button
                            onClick={() => toggleExpand(milestone.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            aria-label="Expand details"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Details: Project & Curated Resources */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                          {/* Suggested Project Idea */}
                          {milestone.projectIdea && (
                            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-blue mb-1">
                                <FolderGit2 className="w-3.5 h-3.5" />
                                Suggested Portfolio Project Idea
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {milestone.projectIdea}
                              </p>
                            </div>
                          )}

                          {/* Recommended Learning Resources */}
                          {milestone.resourceUrls && milestone.resourceUrls.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Curated Recommended Resources
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {milestone.resourceUrls.map((res, idx) => (
                                  <a
                                    key={idx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-brand-blue transition-colors group"
                                  >
                                    <span className="truncate">{res.title}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-blue shrink-0 ml-2" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
