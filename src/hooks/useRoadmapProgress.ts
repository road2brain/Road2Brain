import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { RoadmapProgress } from '@/types';
import { fetchUserRoadmapProgress, toggleMilestoneProgress } from '@/services/progress.service';

export function useRoadmapProgress(roadmapId?: string) {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [progressList, setProgressList] = useState<RoadmapProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!currentUser) {
      setProgressList([]);
      return;
    }
    setLoading(true);
    try {
      const list = await fetchUserRoadmapProgress(currentUser.uid, roadmapId);
      setProgressList(list);
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, roadmapId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const isCompleted = useCallback((milestoneId: string): boolean => {
    const record = progressList.find(p => p.milestoneId === milestoneId);
    return Boolean(record?.completed);
  }, [progressList]);

  const toggleMilestone = async (rId: string, milestoneId: string) => {
    if (!currentUser) {
      showToast('Please sign in to track your learning roadmap milestones.', 'info', 'Sign in required');
      return false;
    }

    const currentState = isCompleted(milestoneId);
    const newState = !currentState;

    try {
      const updated = await toggleMilestoneProgress(currentUser.uid, rId, milestoneId, newState);
      setProgressList(prev => {
        const filtered = prev.filter(p => p.milestoneId !== milestoneId);
        return newState ? [...filtered, updated] : filtered;
      });

      if (newState) {
        showToast('Milestone completed! Keep moving forward.', 'success', 'Milestone Completed 🎯');
      } else {
        showToast('Milestone unmarked.', 'info');
      }
      return newState;
    } catch (err) {
      showToast('Failed to update progress. Please try again.', 'error');
      return currentState;
    }
  };

  return {
    progressList,
    loading,
    isCompleted,
    toggleMilestone,
    refreshProgress: loadProgress,
  };
}
