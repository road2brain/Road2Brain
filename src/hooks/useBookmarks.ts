import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Bookmark } from '@/types';
import { fetchUserBookmarks, addBookmark, removeBookmark } from '@/services/bookmarks.service';

export function useBookmarks() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookmarks = useCallback(async () => {
    if (!currentUser) {
      setBookmarks([]);
      return;
    }
    setLoading(true);
    try {
      const list = await fetchUserBookmarks(currentUser.uid);
      setBookmarks(list);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const isSaved = useCallback((itemId: string): boolean => {
    return bookmarks.some(b => b.itemId === itemId);
  }, [bookmarks]);

  const toggleBookmark = async (itemId: string, itemType: 'opportunity' | 'course') => {
    if (!currentUser) {
      showToast('Please sign in to save opportunities and courses to your dashboard.', 'info', 'Sign in required');
      return false;
    }

    try {
      if (isSaved(itemId)) {
        await removeBookmark(currentUser.uid, itemId);
        setBookmarks(prev => prev.filter(b => b.itemId !== itemId));
        showToast('Removed from your saved items.', 'info');
        return false;
      } else {
        const newBm = await addBookmark(currentUser.uid, itemId, itemType);
        setBookmarks(prev => [newBm, ...prev]);
        showToast('Saved to your personal dashboard!', 'success', 'Saved');
        return true;
      }
    } catch (err) {
      showToast('Could not update saved items. Please try again.', 'error');
      return isSaved(itemId);
    }
  };

  return {
    bookmarks,
    loading,
    isSaved,
    toggleBookmark,
    refreshBookmarks: loadBookmarks,
  };
}
