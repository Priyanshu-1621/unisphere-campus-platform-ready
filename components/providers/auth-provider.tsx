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
  signUp: (data: SignUpData) => Promise<{ error: string | null; needsConfirmation: boolean }>;
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

  const ensureProfile = useCallback(async (uid: string) => {
    if (!isSupabaseConfigured || !sb) return;
    // Try calling the recovery function, then fetch
    await sb.rpc('ensure_profile_exists');
    await fetchProfile(uid);
  }, [fetchProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured || !sb) {
      setLoading(false);
      return;
    }

    sb.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).then(() => {
          // If no profile found, try recovery
          setProfile((current) => {
            if (!current) {
              ensureProfile(s.user.id);
            }
            return current;
          });
        }).finally(() => setLoading(false));
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
          // Recovery: if still no profile, create one
          setProfile((current) => {
            if (!current) {
              ensureProfile(s.user.id);
            }
            return current;
          });
        } else {
          setProfile(null);
        }
        setLoading(false);
      })();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile, ensureProfile]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !sb) {
      return { error: 'Supabase is not configured. Use Demo Mode to explore the app.' };
    }
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        return { error: 'Please confirm your email before signing in. Check your inbox for a confirmation link.' };
      }
      return { error: error.message };
    }
    return { error: null };
  };

  const signUp = async (data: SignUpData) => {
    if (!isSupabaseConfigured || !sb) {
      return { error: 'Supabase is not configured. Use Demo Mode to explore the app.', needsConfirmation: false };
    }

    // The trigger on auth.users will auto-create the profile from metadata.
    // We do NOT insert into profiles here — the trigger handles it.
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

    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'An account with this email already exists. Try signing in instead.', needsConfirmation: false };
      }
      return { error: error.message, needsConfirmation: false };
    }

    // Check if email confirmation is required
    const needsConfirmation = !authData.session;

    if (needsConfirmation) {
      return {
        error: null,
        needsConfirmation: true,
      };
    }

    // If we got a session immediately (email confirmation disabled),
    // the trigger already created the profile. Fetch it.
    if (authData.session && authData.user) {
      await fetchProfile(authData.user.id);
    }

    return { error: null, needsConfirmation: false };
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
