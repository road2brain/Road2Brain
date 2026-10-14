import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { RoadmapProgress } from '@/types';

function getLocalProgress(uid: string): RoadmapProgress[] {
  const key = `r2b_progress_${uid}`;
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveLocalProgress(uid: string, list: RoadmapProgress[]) {
  const key = `r2b_progress_${uid}`;
  localStorage.setItem(key, JSON.stringify(list));
}

export async function fetchUserRoadmapProgress(uid: string, roadmapId?: string): Promise<RoadmapProgress[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, `users/${uid}/roadmapProgress`));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as RoadmapProgress));
      if (roadmapId) {
        return list.filter(p => p.roadmapId === roadmapId);
      }
      return list;
    } catch (err) {
      console.warn('Firestore fetch progress failed:', err);
    }
  }

  const local = getLocalProgress(uid);
  if (roadmapId) {
    return local.filter(p => p.roadmapId === roadmapId);
  }
  return local;
}

export async function toggleMilestoneProgress(
  uid: string, 
  roadmapId: string, 
  milestoneId: string, 
  completed: boolean
): Promise<RoadmapProgress> {
  const progressId = `prog_${roadmapId}_${milestoneId}`;
  const now = new Date().toISOString();

  const progressRecord: RoadmapProgress = {
    id: progressId,
    roadmapId,
    milestoneId,
    completed,
    completedAt: completed ? now : undefined,
  };

  if (isFirebaseConfigured && db) {
    try {
      if (completed) {
        await setDoc(doc(db, `users/${uid}/roadmapProgress`, progressId), progressRecord);
      } else {
        await deleteDoc(doc(db, `users/${uid}/roadmapProgress`, progressId));
      }
    } catch (err) {
      console.warn('Firestore toggleMilestone failed, saving local:', err);
    }
  }

  const local = getLocalProgress(uid);
  const filtered = local.filter(p => p.milestoneId !== milestoneId);
  if (completed) {
    saveLocalProgress(uid, [...filtered, progressRecord]);
  } else {
    saveLocalProgress(uid, filtered);
  }

  return progressRecord;
}
