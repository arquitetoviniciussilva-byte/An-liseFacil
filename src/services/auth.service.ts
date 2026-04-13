import { supabase } from '@/integrations/supabase';
import { User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const authService = {
  async signUp(email: string, password: string, options?: any): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({ email, password }, options);
    return { user: data?.user, error };
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data?.user, error };
  },

  async signOut(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser(): Promise<User | null> {
    return supabase.auth.user();
  },

  async updateProfile(data: any): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.update(data);
    return { error };
  },

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },

  async confirmSignUp(token: string): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.confirmSignUp(token);
    return { error };
  },

  async getAuthState(): Promise<{ user: User | null; session: any }> {
    const { data: { session } } = await supabase.auth.getSession();
    return { user: session?.user, session };
  },
};