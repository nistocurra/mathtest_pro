// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = () => {
      setLoading(true);
      setError(null);

      supabase.auth.getSession()
        .then(({ data: { session }, error }) => {
          if (error) {
            if (isMounted) {
              setError(error.message);
            }
            return;
          }
          
          if (session?.user && isMounted) {
            setUser(session.user);
            return getUserProfile(session.user.id);
          }
          return null;
        })
        .then((profile) => {
          if (isMounted && profile) {
            setUserProfile(profile);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError('Failed to initialize authentication');
            console.log('Auth initialization error:', err);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    };

    initializeAuth();

    const handleAuthChange = (event, session) => {
      if (!isMounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        getUserProfile(session.user.id)
          .then((profile) => {
            if (isMounted && profile) {
              setUserProfile(profile);
            }
          })
          .catch((err) => {
            if (isMounted) {
              setError('Failed to load user profile');
              console.log('Profile loading error:', err);
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setError(null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      return data;
    } catch (err) {
      setError('Failed to fetch user profile');
      console.log('Profile fetch error:', err);
      return null;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      setUserProfile(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      console.log('Profile update error:', err);
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign in';
      setError(errorMessage);
      console.log('Sign in error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      setUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign out';
      setError(errorMessage);
      console.log('Sign out error:', err);
      return { success: false, error: errorMessage };
    }
  };

  const updateLastAccess = async () => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('user_profiles')
        .update({ last_access: new Date().toISOString() })
        .eq('id', user.id);
    } catch (err) {
      console.log('Failed to update last access:', err);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signOut,
    updateLastAccess,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;