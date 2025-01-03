import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useSupabaseAuth } from '../../hooks/useAuth';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const auth = useSupabaseAuth();

  const handleSignIn = async (email: string, password: string) => {
    await auth.signIn(email, password);
    navigate('/'); // ダッシュボードへリダイレクト
  };

  const handleSignUp = async (email: string, password: string) => {
    await auth.signUp(email, password);
    navigate('/'); // ダッシュボードへリダイレクト
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const value = {
    user: auth.user,
    loading: auth.loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 