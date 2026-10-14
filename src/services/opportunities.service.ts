import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { SEED_OPPORTUNITIES } from '@/lib/seedData';
import { Opportunity, OpportunityStatus, VerificationStatus, OpportunityType, LocationType } from '@/types';
import { slugify, isExpired, isValidUrl } from '@/lib/utils';

const STORAGE_KEY = 'r2b_opportunities';

// Local storage helper for offline / demo mode
function getLocalOpportunities(): Opportunity[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_OPPORTUNITIES));
    return SEED_OPPORTUNITIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_OPPORTUNITIES;
  }
}

function saveLocalOpportunities(items: Opportunity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export interface OpportunityFilterOptions {
  search?: string;
  type?: string;
  category?: string;
  academicYear?: string;
  locationType?: string;
  status?: OpportunityStatus;
  verificationStatus?: VerificationStatus;
  sortBy?: 'newest' | 'deadline' | 'relevance';
  includeExpired?: boolean;
}

export async function fetchOpportunities(filters: OpportunityFilterOptions = {}): Promise<Opportunity[]> {
  let list: Opportunity[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const oppsRef = collection(db, 'opportunities');
      // In Firestore, get published/verified or all for admin
      let q = query(oppsRef);
      if (filters.status) {
        q = query(oppsRef, where('status', '==', filters.status));
      }
      const snapshot = await getDocs(q);
      list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Opportunity));
    } catch (err) {
      console.warn('Firestore fetch failed, falling back to local storage:', err);
      list = getLocalOpportunities();
    }
  } else {
    list = getLocalOpportunities();
  }

  // Filter pipeline
  let filtered = [...list];

  // If public browsing and no status is explicitly requested, only show published & verified
  if (!filters.status) {
    filtered = filtered.filter(item => item.status === 'published' && item.verificationStatus === 'verified');
  } else if (filters.status) {
    filtered = filtered.filter(item => item.status === filters.status);
  }

  if (filters.verificationStatus) {
    filtered = filtered.filter(item => item.verificationStatus === filters.verificationStatus);
  }

  // Hide expired opportunities unless requested
  if (!filters.includeExpired) {
    filtered = filtered.filter(item => !isExpired(item.deadline));
  }

  // Filter by Opportunity Type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(item => item.type === filters.type);
  }

  // Filter by Category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(item => item.category.toLowerCase().includes(filters.category!.toLowerCase()));
  }

  // Filter by Academic Year
  if (filters.academicYear && filters.academicYear !== 'all') {
    filtered = filtered.filter(item => 
      item.academicYears && item.academicYears.includes(filters.academicYear as any)
    );
  }

  // Filter by Location Type
  if (filters.locationType && filters.locationType !== 'all') {
    filtered = filtered.filter(item => item.locationType === filters.locationType);
  }

  // Search by keyword (title, company, skills, description)
  if (filters.search && filters.search.trim()) {
    const term = filters.search.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(term) ||
      item.company.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.skills.some(s => s.toLowerCase().includes(term))
    );
  }

  // Sorting
  if (filters.sortBy === 'deadline') {
    filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } else {
    // Default newest
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return filtered;
}

export async function fetchOpportunityBySlug(slug: string): Promise<Opportunity | null> {
  const all = await fetchOpportunities({ includeExpired: true, status: undefined });
  const found = all.find(item => item.slug === slug);
  if (found) return found;

  // Check admin local or direct by id/slug
  const local = getLocalOpportunities();
  return local.find(item => item.slug === slug || item.id === slug) || null;
}

export async function fetchOpportunityById(id: string): Promise<Opportunity | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'opportunities', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Opportunity;
      }
    } catch (err) {
      console.warn('Firestore fetchById failed, trying local:', err);
    }
  }
  const local = getLocalOpportunities();
  return local.find(item => item.id === id) || null;
}

export async function createOpportunity(
  data: Omit<Opportunity, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'verificationStatus' | 'status'>,
  adminUid: string
): Promise<Opportunity> {
  // Validate URLs
  if (!isValidUrl(data.applicationUrl)) {
    throw new Error('Application URL must be a valid HTTP or HTTPS web address.');
  }
  if (!isValidUrl(data.sourceUrl)) {
    throw new Error('Source URL must be a valid HTTP or HTTPS web address.');
  }

  const slug = `${slugify(data.company)}-${slugify(data.title)}-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();

  const newOpp: Opportunity = {
    ...data,
    id: `opp-${Date.now()}`,
    slug,
    status: 'draft',
    verificationStatus: 'pending_verification',
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      const coll = collection(db, 'opportunities');
      const docRef = await addDoc(coll, {
        ...newOpp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      newOpp.id = docRef.id;
    } catch (err) {
      console.warn('Firestore addDoc failed, writing to local storage:', err);
    }
  }

  const local = getLocalOpportunities();
  saveLocalOpportunities([newOpp, ...local]);
  return newOpp;
}

export async function updateOpportunity(
  id: string, 
  data: Partial<Opportunity>, 
  adminUid: string
): Promise<Opportunity> {
  const now = new Date().toISOString();

  if (data.applicationUrl && !isValidUrl(data.applicationUrl)) {
    throw new Error('Invalid Application URL format.');
  }
  if (data.sourceUrl && !isValidUrl(data.sourceUrl)) {
    throw new Error('Invalid Source URL format.');
  }

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'opportunities', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore update failed:', err);
    }
  }

  const local = getLocalOpportunities();
  const index = local.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error('Opportunity not found');
  }

  const updated: Opportunity = {
    ...local[index],
    ...data,
    updatedAt: now,
  };

  local[index] = updated;
  saveLocalOpportunities(local);
  return updated;
}

/**
 * Section 11: Content Verification System
 * Transitions listing to 'verified', updates verifiedAt, verifiedBy, and records audit note.
 */
export async function verifyOpportunity(
  id: string, 
  adminUid: string, 
  notes?: string
): Promise<Opportunity> {
  const now = new Date().toISOString();
  return updateOpportunity(id, {
    verificationStatus: 'verified',
    verifiedAt: now,
    verifiedBy: adminUid,
    adminNotes: notes || 'Verified official student opportunity source.',
  }, adminUid);
}

/**
 * Section 11: Only verified listings can be published
 */
export async function publishOpportunity(
  id: string, 
  adminUid: string
): Promise<Opportunity> {
  const current = await fetchOpportunityById(id);
  if (!current) throw new Error('Listing not found');

  if (current.verificationStatus !== 'verified') {
    throw new Error('Cannot publish an unverified listing. You must verify official sources first.');
  }

  return updateOpportunity(id, {
    status: 'published',
  }, adminUid);
}

export async function expireOpportunity(id: string, adminUid: string): Promise<Opportunity> {
  return updateOpportunity(id, { status: 'expired' }, adminUid);
}

export async function archiveOpportunity(id: string, adminUid: string): Promise<Opportunity> {
  return updateOpportunity(id, { status: 'archived' }, adminUid);
}

export async function rejectOpportunity(id: string, adminUid: string, notes?: string): Promise<Opportunity> {
  return updateOpportunity(id, { 
    verificationStatus: 'rejected', 
    status: 'draft',
    adminNotes: notes || 'Rejected due to invalid or unconfirmed official source.'
  }, adminUid);
}

export async function deleteOpportunity(id: string, adminUid: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'opportunities', id));
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }
  }
  const local = getLocalOpportunities();
  saveLocalOpportunities(local.filter(o => o.id !== id));
}
