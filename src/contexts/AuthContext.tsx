import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { UserMembership, type Certificate } from '../types';

interface AuthState {
  userName: string;
  userEmail: string;
  userMembership: UserMembership;
  certificates: Certificate[];
}

interface AuthContextValue extends AuthState {
  onChangeProfile: (name: string, email: string, membership: UserMembership) => void;
  addCertificate: (cert: Certificate) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string>("Nelson Durán");
  const [userEmail, setUserEmail] = useState<string>("noslen.dur@gmail.com");
  const [userMembership, setUserMembership] = useState<UserMembership>(UserMembership.Free);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const onChangeProfile = useCallback((name: string, email: string, membership: UserMembership) => {
    setUserName(name);
    setUserEmail(email);
    setUserMembership(membership);
  }, []);

  const addCertificate = useCallback((cert: Certificate) => {
    setCertificates(prev => [cert, ...prev]);
  }, []);

  return (
    <AuthContext.Provider value={{ userName, userEmail, userMembership, certificates, onChangeProfile, addCertificate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
