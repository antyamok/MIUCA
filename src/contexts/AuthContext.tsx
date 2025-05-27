import React, { createContext, useState, useContext, useEffect } from 'react';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('muica_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Pour la démonstration, nous simulons un login admin avec des identifiants spécifiques
    if (email === 'admin@muica.com' && password === 'admin123') {
      const adminUser = {
        id: 'admin-1',
        name: 'Admin MUICA',
        email: email,
        role: 'admin' as const
      };
      
      setUser(adminUser);
      localStorage.setItem('muica_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    }
    
    // Pour les clients normaux
    if (email && password) {
      const clientUser = {
        id: 'client-1',
        name: 'John Doe',
        email: email,
        role: 'client' as const
      };
      
      setUser(clientUser);
      localStorage.setItem('muica_user', JSON.stringify(clientUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('muica_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};