import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import ClientDashboard from '../pages/ClientDashboardPage';
import LoginForm from '../components/LoginForm'; // à créer si ce n'est pas fait
import PrivateRoute from '../contexts/PrivateRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route
      path="/admin"
      element={
        <PrivateRoute role="admin">
          <AdminDashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/client"
      element={
        <PrivateRoute role="client">
          <ClientDashboard />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;

