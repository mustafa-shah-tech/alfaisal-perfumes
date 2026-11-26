// ============================================================
// Auth Context — Firebase Authentication Provider
// ============================================================
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemoMode: true,
  login: async () => {},
  logout: async () => {},
  changePassword: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase credentials are not yet configured in .env.local, check for local demo session
    if (!isFirebaseConfigured) {
      try {
        const storedDemo = localStorage.getItem('alfaisal_demo_admin');
        if (storedDemo) {
          const parsed = JSON.parse(storedDemo);
          setUser({
            uid: 'demo-admin-id',
            email: parsed.email || 'admin@alfaisalperfumes.com',
            displayName: 'Alfaisal Admin',
          } as unknown as User);
        }
      } catch (err) {
        console.warn('Demo session note:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Live Firebase Authentication
    try {
      if (auth && Object.keys(auth).length > 0) {
        const unsubscribe = onAuthStateChanged(
          auth,
          (currentUser) => {
            setUser(currentUser);
            setLoading(false);
          },
          (err) => {
            console.warn('Auth state notice:', err);
            setLoading(false);
          }
        );
        return () => {
          if (typeof unsubscribe === 'function') unsubscribe();
        };
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.warn('Auth state observer note:', err);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // If in demo preview mode (no Firebase keys configured yet)
    if (!isFirebaseConfigured) {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please enter an email and password.');
      }
      const demoUser = {
        uid: 'demo-admin-id',
        email: email.trim(),
        displayName: 'Alfaisal Admin',
      } as unknown as User;

      setUser(demoUser);
      localStorage.setItem('alfaisal_demo_admin', JSON.stringify({ email: email.trim() }));
      return;
    }

    // Live Firebase login
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem('alfaisal_demo_admin');
      setUser(null);
      return;
    }

    if (auth && Object.keys(auth).length > 0) {
      await signOut(auth);
    }
    setUser(null);
  };

  const changePassword = async (newPassword: string) => {
    if (!isFirebaseConfigured) {
      return; // No-op in demo preview mode
    }
    if (!auth?.currentUser) throw new Error('No user logged in');
    await updatePassword(auth.currentUser, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode: !isFirebaseConfigured,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
