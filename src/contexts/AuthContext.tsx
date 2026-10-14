import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { UserProfile, UserRole, AcademicYear } from '@/types';
import { fetchUserProfile, createUserProfile, updateUserProfile } from '@/services/user.service';

interface AuthContextType {
  currentUser: { uid: string; email: string | null; displayName: string | null } | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, profileData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateStudentProfile: (updates: Partial<UserProfile>) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_USER_KEY = 'r2b_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setCurrentUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
          });
          const prof = await fetchUserProfile(fbUser.uid);
          setProfile(prof);
        } else {
          setCurrentUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local fallback initialization
      const stored = localStorage.getItem(LOCAL_AUTH_USER_KEY);
      if (stored) {
        try {
          const user = JSON.parse(stored);
          setCurrentUser(user);
          fetchUserProfile(user.uid).then(p => {
            setProfile(p);
            setLoading(false);
          });
        } catch {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const prof = await fetchUserProfile(cred.user.uid);
        setProfile(prof);
      } else {
        // Local mode mock login
        const isDefaultAdmin = email.toLowerCase().includes('admin');
        const uid = `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const mockUser = {
          uid,
          email,
          displayName: email.split('@')[0],
        };
        localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(mockUser));
        setCurrentUser(mockUser);

        let prof = await fetchUserProfile(uid);
        if (!prof) {
          prof = await createUserProfile({
            uid,
            email,
            displayName: email.split('@')[0],
            role: isDefaultAdmin ? 'admin' : 'student',
            branch: 'CSE',
            currentYear: '3rd Year',
            targetCareerTrack: 'Software Development Engineer',
            selectedRoadmapId: 'roadmap-sde',
            skills: ['Java', 'C++', 'Data Structures', 'React'],
            interests: ['Web Development', 'Cloud Computing'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        setProfile(prof);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, pass: string, profileData: Partial<UserProfile>) => {
    setLoading(true);
    try {
      let uid = '';
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        uid = cred.user.uid;
      } else {
        uid = `user_${Date.now()}`;
        const mockUser = {
          uid,
          email,
          displayName: profileData.displayName || email.split('@')[0],
        };
        localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(mockUser));
        setCurrentUser(mockUser);
      }

      // Security rule: newly registered users always start as 'student' role
      const initialProfile: UserProfile = {
        uid,
        email,
        displayName: profileData.displayName || 'Student',
        role: 'student', // Client-side cannot escalate to admin
        branch: profileData.branch || 'CSE',
        collegeName: profileData.collegeName || '',
        graduationYear: profileData.graduationYear || 2027,
        currentYear: profileData.currentYear || '2nd Year',
        interests: profileData.interests || [],
        skills: profileData.skills || [],
        targetCareerTrack: profileData.targetCareerTrack || 'Software Development Engineer',
        selectedRoadmapId: profileData.selectedRoadmapId || 'roadmap-sde',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const created = await createUserProfile(initialProfile);
      setProfile(created);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await firebaseSignOut(auth);
      }
      localStorage.removeItem(LOCAL_AUTH_USER_KEY);
      setCurrentUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      // Simulation for local mode
      console.info(`Password reset email simulated for ${email}`);
    }
  };

  const updateStudentProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser || !profile) return;
    // Security check: cannot change own role
    const safeUpdates = { ...updates };
    delete safeUpdates.role;
    delete (safeUpdates as any).uid;

    const updated = await updateUserProfile(currentUser.uid, safeUpdates);
    setProfile(updated);
  };

  /**
   * Fast 1-click demo login for reviewing student & admin workflows
   */
  const demoLogin = async (role: UserRole) => {
    const email = role === 'admin' ? 'admin@road2brain.com' : 'student.cse@road2brain.com';
    const uid = role === 'admin' ? 'admin_road2brain_demo' : 'student_demo_user';
    const mockUser = {
      uid,
      email,
      displayName: role === 'admin' ? 'R2B Admin Team' : 'Arjun Sharma',
    };

    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(mockUser));
    setCurrentUser(mockUser);

    const demoProfile: UserProfile = {
      uid,
      email,
      displayName: mockUser.displayName,
      role,
      branch: 'CSE',
      collegeName: 'National Institute of Technology',
      graduationYear: 2027,
      currentYear: '3rd Year',
      interests: ['Distributed Systems', 'Full Stack Development', 'AI/ML'],
      skills: ['Java', 'C++', 'React', 'Data Structures', 'Git'],
      targetCareerTrack: 'Software Development Engineer',
      selectedRoadmapId: 'roadmap-sde',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createUserProfile(demoProfile);
    setProfile(demoProfile);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        isAdmin,
        login,
        signup,
        logout,
        resetPassword,
        updateStudentProfile,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
