import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieManager from './components/CookieManager';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import ClientAreaPage from './pages/ClientAreaPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import ClientProjectPage from './pages/ClientProjectPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PricingPage from './pages/PricingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

import { initBlobCursor } from '../cursor';
import '../cursor.css';

function App() {
  useEffect(() => {
    // Initialize cursor only on desktop
    if (window.innerWidth >= 1024) {
      try {
        initBlobCursor();
      } catch (error) {
        console.warn('Cursor initialization failed:', error);
      }
    }
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/client-area" element={<ClientAreaPage />} />
                <Route
                  path="/client"
                  element={
                    <ProtectedRoute>
                      <ClientDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/client/project/:id"
                  element={
                    <ProtectedRoute>
                      <ClientProjectPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
            <CookieManager />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;