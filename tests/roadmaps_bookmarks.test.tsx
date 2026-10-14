import { describe, it, expect, beforeEach } from 'vitest';
import { fetchCourses } from '@/services/courses.service';
import { fetchRoadmaps, fetchRoadmapBySlug } from '@/services/roadmaps.service';
import { addBookmark, removeBookmark, fetchUserBookmarks } from '@/services/bookmarks.service';
import { toggleMilestoneProgress, fetchUserRoadmapProgress } from '@/services/progress.service';

describe('Roadmaps, Courses & Bookmark Persistence Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('6. saves and removes bookmarks for student across sessions', async () => {
    const studentUid = 'student_test_user_42';

    // Initially empty
    let bookmarks = await fetchUserBookmarks(studentUid);
    expect(bookmarks.length).toBe(0);

    // Save an opportunity
    await addBookmark(studentUid, 'opp-1', 'opportunity');
    // Save a course
    await addBookmark(studentUid, 'course-1', 'course');

    bookmarks = await fetchUserBookmarks(studentUid);
    expect(bookmarks.length).toBe(2);
    expect(bookmarks.some(b => b.itemId === 'opp-1')).toBe(true);
    expect(bookmarks.some(b => b.itemId === 'course-1')).toBe(true);

    // Remove the opportunity bookmark
    await removeBookmark(studentUid, 'opp-1');
    bookmarks = await fetchUserBookmarks(studentUid);
    expect(bookmarks.length).toBe(1);
    expect(bookmarks[0].itemId).toBe('course-1');
  });

  it('7. allows course browsing, search, and free/paid filtering', async () => {
    const allCourses = await fetchCourses();
    expect(allCourses.length).toBeGreaterThan(0);

    const freeCourses = await fetchCourses({ priceType: 'free' });
    expect(freeCourses.length).toBeGreaterThan(0);
    freeCourses.forEach(c => {
      expect(c.priceType).toBe('free');
      expect(c.price).toBe(0);
    });

    const dsaCourses = await fetchCourses({ search: 'DSA' });
    expect(dsaCourses.length).toBeGreaterThan(0);
    expect(dsaCourses[0].category).toBe('DSA');
  });

  it('8 & 9. loads career roadmaps and persists milestone completion', async () => {
    const roadmaps = await fetchRoadmaps();
    expect(roadmaps.length).toBe(3); // SDE, AI/ML, Data Analyst

    const sde = await fetchRoadmapBySlug('software-development-engineer');
    expect(sde).not.toBeNull();
    expect(sde?.milestones?.length).toBeGreaterThan(5);

    const studentUid = 'student_test_user_42';
    const firstMilestoneId = sde!.milestones![0].id;

    // Check initial progress
    let progress = await fetchUserRoadmapProgress(studentUid, sde!.id);
    expect(progress.length).toBe(0);

    // Mark milestone 1 as completed
    await toggleMilestoneProgress(studentUid, sde!.id, firstMilestoneId, true);

    progress = await fetchUserRoadmapProgress(studentUid, sde!.id);
    expect(progress.length).toBe(1);
    expect(progress[0].milestoneId).toBe(firstMilestoneId);
    expect(progress[0].completed).toBe(true);
    expect(progress[0].completedAt).toBeTruthy();

    // Toggle back to incomplete
    await toggleMilestoneProgress(studentUid, sde!.id, firstMilestoneId, false);
    progress = await fetchUserRoadmapProgress(studentUid, sde!.id);
    expect(progress.length).toBe(0);
  });
});
