import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { Bookmark } from '@/types';

function getLocalBookmarks(uid: string): Bookmark[] {
  const key = `r2b_bookmarks_${uid}`;
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveLocalBookmarks(uid: string, list: Bookmark[]) {
  const key = `r2b_bookmarks_${uid}`;
  localStorage.setItem(key, JSON.stringify(list));
}

export async function fetchUserBookmarks(uid: string): Promise<Bookmark[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, `users/${uid}/bookmarks`));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Bookmark));
    } catch (err) {
      console.warn('Firestore fetchUserBookmarks failed, fallback to local:', err);
    }
  }
  return getLocalBookmarks(uid);
}

export async function addBookmark(
  uid: string, 
  itemId: string, 
  itemType: 'opportunity' | 'course'
): Promise<Bookmark> {
  const now = new Date().toISOString();
  const bookmarkId = `bm_${itemId}`;

  const bookmark: Bookmark = {
    id: bookmarkId,
    itemId,
    itemType,
    savedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, `users/${uid}/bookmarks`, bookmarkId), bookmark);
    } catch (err) {
      console.warn('Firestore addBookmark failed, saving locally:', err);
    }
  }

  const local = getLocalBookmarks(uid);
  if (!local.some(b => b.itemId === itemId)) {
    saveLocalBookmarks(uid, [bookmark, ...local]);
  }
  return bookmark;
}

export async function removeBookmark(uid: string, itemId: string): Promise<void> {
  const bookmarkId = `bm_${itemId}`;

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, `users/${uid}/bookmarks`, bookmarkId));
    } catch (err) {
      console.warn('Firestore removeBookmark failed:', err);
    }
  }

  const local = getLocalBookmarks(uid);
  saveLocalBookmarks(uid, local.filter(b => b.itemId !== itemId && b.id !== itemId));
}
