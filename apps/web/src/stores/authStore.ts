import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Parent, Child, Family } from '../types';

interface AuthStore {
  user: Parent | null;
  childSession: Child | null;
  family: Family | null;
  loading: boolean;
  isParent: boolean;
  isChild: boolean;

  // Parent auth
  signUp: (email: string, password: string, displayName: string, familyName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Child auth (PIN-based)
  childLogin: (familyId: string, childId: string, pin: string) => Promise<void>;
  childLogout: () => void;

  // Init
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  childSession: null,
  family: null,
  loading: true,
  isParent: false,
  isChild: false,

  signUp: async (email, password, displayName, familyName) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    // Create family
    const { data: family, error: famError } = await supabase
      .from('families')
      .insert({ name: familyName })
      .select()
      .single();
    if (famError) throw famError;

    // Create parent profile
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .insert({
        id: authData.user.id,
        family_id: family.id,
        display_name: displayName,
      })
      .select()
      .single();
    if (parentError) throw parentError;

    set({ user: parent, family, isParent: true, isChild: false });
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await get().initialize();
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, family: null, childSession: null, isParent: false, isChild: false });
  },

  childLogin: async (familyId, childId, pin) => {
    // Verify PIN via Edge Function (server-side bcrypt compare)
    const { data, error } = await supabase.functions.invoke('verify-child-pin', {
      body: { child_id: childId, pin },
    });
    if (error || !data?.valid) throw new Error('PIN 錯誤');

    // Fetch child data
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .single();
    if (childError) throw childError;

    const { data: family } = await supabase
      .from('families')
      .select('*')
      .eq('id', familyId)
      .single();

    set({ childSession: child, family, isChild: true, isParent: false });
    // Store child session in localStorage for persistence
    localStorage.setItem('kidquest_child_session', JSON.stringify({ childId, familyId }));
  },

  childLogout: () => {
    localStorage.removeItem('kidquest_child_session');
    set({ childSession: null, isChild: false });
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Parent login
        const { data: parent } = await supabase
          .from('parents')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (parent) {
          const { data: family } = await supabase
            .from('families')
            .select('*')
            .eq('id', parent.family_id)
            .single();

          set({ user: parent, family, isParent: true, isChild: false });
        }
      } else {
        // Check for child session
        const stored = localStorage.getItem('kidquest_child_session');
        if (stored) {
          const { childId, familyId } = JSON.parse(stored);
          const { data: child } = await supabase
            .from('children')
            .select('*')
            .eq('id', childId)
            .single();
          const { data: family } = await supabase
            .from('families')
            .select('*')
            .eq('id', familyId)
            .single();
          if (child) {
            set({ childSession: child, family, isChild: true, isParent: false });
          }
        }
      }
    } catch (err) {
      console.error('Auth init error:', err);
    } finally {
      set({ loading: false });
    }
  },
}));
