import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
  role?: 'admin' | 'client';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Chargement...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/client'} />;
  }

  return children;
};

export default PrivateRoute;
