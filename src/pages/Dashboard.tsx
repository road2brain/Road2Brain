import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useRoadmapProgress } from '@/hooks/useRoadmapProgress';
import { fetchOpportunities } from '@/services/opportunities.service';
import { fetchCourses } from '@/services/courses.service';
import { fetchRoadmaps } from '@/services/roadmaps.service';
import { fetchStudentIssues } from '@/services/issues.service';
import { Opportunity, Course, Roadmap, IssueQuery } from '@/types';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { RoadmapProgressCard } from '@/components/dashboard/RoadmapProgressCard';
import { RecommendationsList } from '@/components/dashboard/RecommendationsList';
import { SavedItemsList } from '@/components/dashboard/SavedItemsList';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { CardSkeleton } from '@/components/common/Skeleton';
import { formatDate } from '@/lib/utils';

export const Dashboard: React.FC = () => {
  const { profile, currentUser } = useAuth();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  const { progressList, loading: progressLoading } = useRoadmapProgress(profile?.selectedRoadmapId);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [studentIssues, setStudentIssues] = useState<IssueQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = currentUser?.uid || profile?.email || 'student_demo_1';
    Promise.all([
      fetchOpportunities({ includeExpired: true }),
      fetchCourses(),
      fetchRoadmaps(),
      fetchStudentIssues(studentId),
    ])
      .then(([opps, crs, rms, iss]) => {
        setOpportunities(opps);
        setCourses(crs);
        setRoadmaps(rms);
        setStudentIssues(iss);
      })
      .finally(() => setLoading(false));
  }, [currentUser, profile]);

  // Determine active roadmap & next milestone
  const activeRoadmap = roadmaps.find(r => r.id === profile?.selectedRoadmapId || r.slug === profile?.selectedRoadmapId) || roadmaps[0] || null;
  const completedMilestoneIds = progressList.filter(p => p.completed).map(p => p.milestoneId);
  const nextIncompleteMilestone = activeRoadmap?.milestones?.find(m => !completedMilestoneIds.includes(m.id)) || null;

  if (loading || bookmarksLoading || progressLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* 1. Welcome Section */}
      <WelcomeBanner
        profile={profile}
        nextMilestoneTitle={nextIncompleteMilestone?.title}
        roadmapSlug={activeRoadmap?.slug}
      />

      {/* 2. Upcoming Saved Deadlines Alert */}
      <UpcomingDeadlines
        bookmarks={bookmarks}
        allOpportunities={opportunities}
      />

      {/* 3. Quick Actions Grid */}
      <QuickActions />

      {/* 4. Split Grid: Roadmap Progress & Saved Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-1">
          <RoadmapProgressCard
            roadmap={activeRoadmap}
            completedMilestoneIds={completedMilestoneIds}
            nextMilestone={nextIncompleteMilestone}
          />
        </div>

        <div className="lg:col-span-2">
          <SavedItemsList
            bookmarks={bookmarks}
            allOpportunities={opportunities}
            allCourses={courses}
          />
        </div>
      </div>

      {/* 5. Recommended Opportunities */}
      <div className="mt-8">
        <RecommendationsList
          opportunities={opportunities}
          profile={profile}
        />
      </div>

      {/* 6. Student Support Queries & Resolution Desk */}
      <div className="mt-10">
        <Card className="p-6 border border-slate-200/90 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-blue" />
                <h3 className="text-base font-extrabold text-slate-900">
                  My Support Queries & Issue Status
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Track broken link reports, eligibility questions, and direct admin responses.
              </p>
            </div>

            <Link to="/raise-issue">
              <Button variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                + Raise New Query
              </Button>
            </Link>
          </div>

          {studentIssues.length > 0 ? (
            <div className="space-y-3">
              {studentIssues.slice(0, 3).map((issue) => (
                <div key={issue.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-50/80 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          issue.status === 'resolved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : issue.status === 'in_progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {issue.status === 'resolved' ? 'Resolved' : issue.status === 'in_progress' ? 'In Review' : 'Open'}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">•</span>
                        <span className="text-xs text-slate-400 font-medium">{formatDate(issue.createdAt)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{issue.subject}</h4>
                    </div>

                    <Link to="/raise-issue">
                      <Button variant="ghost" size="sm" className="text-xs text-brand-blue font-semibold shrink-0">
                        View Thread <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  {issue.adminReply && (
                    <div className="mt-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200/70 text-xs text-slate-800 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-900">Admin Answer: </span>
                        <span className="text-slate-700">{issue.adminReply}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              <p className="font-medium text-slate-700">No support issues or queries raised yet.</p>
              <p className="text-slate-400 mt-0.5">Found an expired link or have an application question? Reach out to our verification desk.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
