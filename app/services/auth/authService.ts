import { supabase } from '../supabase/supabaseClient';

export type AuthResult = {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
};

export type SignUpData = {
  email: string;
  password: string;
  displayName: string;
};

export type SignInData = {
  email: string;
  password: string;
};

/**
 * Authentication service for handling user authentication operations
 */
export const authService = {
  /**
   * Get user profile data from the users table
   */
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Sign up a new user with email, password and display name
   */
  async signUp({ email, password, displayName }: SignUpData): Promise<AuthResult> {
    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'User creation failed',
        };
      }

      // Then, update the user's metadata with display name
      const { error: updateError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            full_name: displayName,
            email: email,
          },
        ]);

      if (updateError) {
        // If profile creation fails, we should still return success since the auth account was created
        console.error('Failed to create user profile:', updateError);
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  },

  /**
   * Sign in an existing user with email and password
   */
  async signIn({ email, password }: SignInData): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  },

  /**
   * Get the current session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        session: data.session,
        user: data.session?.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  },

  /**
   * Get the current user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  },
};
