import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string): Promise<{ success: boolean; redirectTo?: string }> => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError || !authData.user) throw authError ?? new Error('No user data returned');

      const userEmail = authData.user.email;
      if (!userEmail) throw new Error('No email found in auth data');

      // Look up admin by email instead of auth user ID
      const { data: adminData } = await supabase
        .from('admins')
        .select('id, email, role, name')
        .eq('email', userEmail)
        .maybeSingle();

      if (adminData) {
        const adminUser = { 
          id: adminData.id, // Use the admin table ID
          name: adminData.name ?? userEmail.split('@')[0], 
          email: adminData.email, 
          role: 'admin' as const 
        };
        setUser(adminUser);
        setIsLoading(false);
        return { success: true, redirectTo: '/admin' };
      }

      // Look up client by email instead of auth user ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('email', userEmail)
        .maybeSingle();

      if (clientData) {
        const clientUser = { 
          id: clientData.id, // Use the client table ID
          name: clientData.name ?? userEmail.split('@')[0], 
          email: clientData.email, 
          role: 'client' as const 
        };

        // Update last_seen using the client table ID
        await supabase
          .from('clients')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', clientData.id);

        setUser(clientUser);
        setIsLoading(false);
        return { success: true, redirectTo: '/client' };
      }

      await supabase.auth.signOut();
      throw new Error('User not found in DB');

    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      if (!email) return setIsLoading(false);

      try {
        // Look up admin by email
        const { data: adminData } = await supabase
          .from('admins')
          .select('id, email, role, name')
          .eq('email', email)
          .maybeSingle();

        if (adminData) {
          setUser({ id: adminData.id, name: adminData.name ?? email.split('@')[0], email, role: 'admin' });
          setIsLoading(false);
          return;
        }

        // Look up client by email
        const { data: clientData } = await supabase
          .from('clients')
          .select('id, name, email')
          .eq('email', email)
          .maybeSingle();

        if (clientData) {
          setUser({ id: clientData.id, name: clientData.name ?? email.split('@')[0], email, role: 'client' });
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setUser(null);
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};