'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { demoProfile } from '@/lib/demo-data';
import type { Profile } from '@/types';

const sb = isSupabaseConfigured ? supabase : null;

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

interface SignUpData {
  full_name: string;
  email: string;
  password: string;
  branch: string;
  course: string;
  batch: string;
  year: string;
  semester: string;
  section: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchProfile = useCallback(async (uid: string) => {
    if (!isSupabaseConfigured || !sb) return;
    const { data } = await sb
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();
    if (data) {
      setProfile(data as Profile);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !sb) {
      setLoading(false);
      return;
    }

    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = sb.auth.onAuthStateChange((_event, s) => {
      (async () => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !sb) {
      return { error: 'Supabase is not configured. Use Demo Mode to explore the app.' };
    }
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (data: SignUpData) => {
    if (!isSupabaseConfigured || !sb) {
      return { error: 'Supabase is not configured. Use Demo Mode to explore the app.' };
    }

    const { data: authData, error } = await sb.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          branch: data.branch,
          course: data.course,
          batch: data.batch,
          year: data.year,
          semester: data.semester,
          section: data.section,
        },
      },
    });

    if (error) return { error: error.message };

    if (authData.user) {
      const { error: profileError } = await sb.from('profiles').insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        branch: data.branch,
        course: data.course,
        batch_start: parseInt(data.batch),
        current_year: parseInt(data.year),
        semester: parseInt(data.semester),
        section: data.section.trim(),
        role: 'student',
        is_verified_contributor: false,
        interests: [],
        skills: [],
        achievements: [],
        certifications: [],
      });
      if (profileError) {
        return { error: `Account created but profile setup failed: ${profileError.message}. Please sign in to continue.` };
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    setIsDemoMode(false);
    setProfile(null);
    setUser(null);
    setSession(null);
    if (isSupabaseConfigured && sb) {
      await sb.auth.signOut();
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setProfile(demoProfile);
    setUser({
      id: demoProfile.id,
      email: demoProfile.email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      identities: [],
      created_at: demoProfile.created_at,
    } as User);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        enterDemoMode,
        exitDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
