import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useRoadmapProgress } from '@/hooks/useRoadmapProgress';
import { fetchOpportunities } from '@/services/opportunities.service';
import { fetchCourses } from '@/services/courses.service';
import { fetchRoadmaps } from '@/services/roadmaps.service';
import { Opportunity, Course, Roadmap } from '@/types';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { RoadmapProgressCard } from '@/components/dashboard/RoadmapProgressCard';
import { RecommendationsList } from '@/components/dashboard/RecommendationsList';
import { SavedItemsList } from '@/components/dashboard/SavedItemsList';
import { CardSkeleton } from '@/components/common/Skeleton';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  const { progressList, loading: progressLoading } = useRoadmapProgress(profile?.selectedRoadmapId);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchOpportunities({ includeExpired: true }),
      fetchCourses(),
      fetchRoadmaps(),
    ])
      .then(([opps, crs, rms]) => {
        setOpportunities(opps);
        setCourses(crs);
        setRoadmaps(rms);
      })
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
};
