import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { SEED_COURSES } from '@/lib/seedData';
import { Course, CourseLevel, CoursePriceType, CourseStatus } from '@/types';
import { slugify, isValidUrl } from '@/lib/utils';

const STORAGE_KEY = 'r2b_courses';

function getLocalCourses(): Course[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COURSES));
    return SEED_COURSES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_COURSES;
  }
}

function saveLocalCourses(items: Course[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export interface CourseFilterOptions {
  search?: string;
  category?: string;
  level?: CourseLevel | 'all';
  priceType?: CoursePriceType | 'all';
  certificateOnly?: boolean;
  status?: CourseStatus;
}

export async function fetchCourses(filters: CourseFilterOptions = {}): Promise<Course[]> {
  let list: Course[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'courses'));
      list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
    } catch (err) {
      console.warn('Firestore fetch courses failed, fallback to local:', err);
      list = getLocalCourses();
    }
  } else {
    list = getLocalCourses();
  }

  let filtered = [...list];

  // Default to published unless admin specified
  if (!filters.status) {
    filtered = filtered.filter(c => c.status === 'published');
  } else {
    filtered = filtered.filter(c => c.status === filters.status);
  }

  // Filter category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(c => c.category.toLowerCase() === filters.category!.toLowerCase());
  }

  // Filter level
  if (filters.level && filters.level !== 'all') {
    filtered = filtered.filter(c => c.level === filters.level);
  }

  // Filter priceType
  if (filters.priceType && filters.priceType !== 'all') {
    filtered = filtered.filter(c => c.priceType === filters.priceType);
  }

  // Certificate only
  if (filters.certificateOnly) {
    filtered = filtered.filter(c => c.certificateAvailable);
  }

  // Search keyword
  if (filters.search && filters.search.trim()) {
    const term = filters.search.toLowerCase().trim();
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(term) ||
      c.provider.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    );
  }

  return filtered;
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const all = await fetchCourses({ status: undefined });
  return all.find(c => c.slug === slug || c.id === slug) || null;
}

export async function createCourse(
  data: Omit<Course, 'id' | 'slug' | 'createdAt' | 'updatedAt'>,
  adminUid: string
): Promise<Course> {
  if (!isValidUrl(data.officialUrl)) {
    throw new Error('Official course URL must be a valid HTTP or HTTPS web address.');
  }

  const slug = slugify(data.title);
  const now = new Date().toISOString();

  const newCourse: Course = {
    ...data,
    id: `course-${Date.now()}`,
    slug,
    priceVerifiedAt: now,
    verifiedAt: now,
    verificationStatus: 'verified',
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...newCourse,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      newCourse.id = docRef.id;
    } catch (err) {
      console.warn('Firestore createCourse failed:', err);
    }
  }

  const local = getLocalCourses();
  saveLocalCourses([newCourse, ...local]);
  return newCourse;
}

export async function updateCourse(
  id: string,
  data: Partial<Course>,
  adminUid: string
): Promise<Course> {
  const now = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'courses', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore updateCourse failed:', err);
    }
  }

  const local = getLocalCourses();
  const index = local.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Course not found');

  const updated: Course = {
    ...local[index],
    ...data,
    updatedAt: now,
  };

  local[index] = updated;
  saveLocalCourses(local);
  return updated;
}

export async function verifyCoursePrice(id: string, adminUid: string): Promise<Course> {
  return updateCourse(id, { priceVerifiedAt: new Date().toISOString() }, adminUid);
}

export async function deleteCourse(id: string, adminUid: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (err) {
      console.warn('Firestore deleteCourse failed:', err);
    }
  }
  const local = getLocalCourses();
  saveLocalCourses(local.filter(c => c.id !== id));
}
