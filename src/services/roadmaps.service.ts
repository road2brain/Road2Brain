import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { SEED_ROADMAPS } from '@/lib/seedData';
import { Roadmap, Milestone } from '@/types';
import { slugify } from '@/lib/utils';

const STORAGE_KEY = 'r2b_roadmaps';

function getLocalRoadmaps(): Roadmap[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ROADMAPS));
    return SEED_ROADMAPS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_ROADMAPS;
  }
}

function saveLocalRoadmaps(roadmaps: Roadmap[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps));
}

export async function fetchRoadmaps(): Promise<Roadmap[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'roadmaps'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Roadmap));
      }
    } catch (err) {
      console.warn('Firestore fetch roadmaps failed, fallback to local:', err);
    }
  }
  return getLocalRoadmaps();
}

export async function fetchRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  const all = await fetchRoadmaps();
  return all.find(r => r.slug === slug || r.id === slug) || null;
}

export async function createRoadmap(
  data: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>,
  adminUid: string
): Promise<Roadmap> {
  const slug = slugify(data.title);
  const now = new Date().toISOString();

  const newRoadmap: Roadmap = {
    ...data,
    id: `roadmap-${Date.now()}`,
    slug,
    createdAt: now,
    updatedAt: now,
  };

  const local = getLocalRoadmaps();
  saveLocalRoadmaps([newRoadmap, ...local]);
  return newRoadmap;
}
