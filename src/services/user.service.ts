import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { UserProfile } from '@/types';

const STORAGE_KEY = 'r2b_current_user_profile';
const ALL_USERS_KEY = 'r2b_all_users';

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Firestore fetchUserProfile failed:', err);
    }
  }

  // Fallback to local
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.uid === uid) return parsed;
    } catch {
      // ignore
    }
  }
  return null;
}

export async function createUserProfile(profile: UserProfile): Promise<UserProfile> {
  const now = new Date().toISOString();
  const fullProfile: UserProfile = {
    ...profile,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', profile.uid), {
        ...fullProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore createUserProfile failed:', err);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(fullProfile));
  
  // Track in all users list for local admin inspector
  const allUsersStr = localStorage.getItem(ALL_USERS_KEY);
  let allUsers: UserProfile[] = [];
  if (allUsersStr) {
    try { allUsers = JSON.parse(allUsersStr); } catch {}
  }
  const filtered = allUsers.filter(u => u.uid !== profile.uid);
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify([...filtered, fullProfile]));

  return fullProfile;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const current = await fetchUserProfile(uid);
  const now = new Date().toISOString();

  // Section 10: Security check — protect against client-side role escalation
  if ('role' in updates && current && updates.role !== current.role) {
    console.warn('Prevented role escalation attempt on client.');
    delete updates.role;
  }

  const updated: UserProfile = {
    ...(current || { uid, email: '', displayName: '', role: 'student', createdAt: now, updatedAt: now }),
    ...updates,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore updateUserProfile failed:', err);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Update in all users
  const allUsersStr = localStorage.getItem(ALL_USERS_KEY);
  if (allUsersStr) {
    try {
      const allUsers: UserProfile[] = JSON.parse(allUsersStr);
      const idx = allUsers.findIndex(u => u.uid === uid);
      if (idx !== -1) {
        allUsers[idx] = updated;
        localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
      }
    } catch {}
  }

  return updated;
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      return snap.docs.map(d => d.data() as UserProfile);
    } catch (err) {
      console.warn('Firestore fetchAllUsers failed:', err);
    }
  }

  const allUsersStr = localStorage.getItem(ALL_USERS_KEY);
  if (allUsersStr) {
    try {
      return JSON.parse(allUsersStr);
    } catch {}
  }
  return [];
}
