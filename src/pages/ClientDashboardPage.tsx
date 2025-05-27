import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogOut, Home, FileText, MessageSquare, Settings, BookOpen } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import DocumentsInterface from '../components/DocumentsInterface';
import SettingsInterface from '../components/SettingsInterface';
import AdminBlogInterface from '../components/AdminBlogInterface';

const ClientDashboardPage: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'messages' | 'documents' | 'settings' | 'blog'>('dashboard');

  // Mock user data for settings
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  };

  // Mock client projects data
  const clientProjects = [
    {
      id: '1',
      title: 'Eco Harmony Villa',
      status: 'In Progress',
      progress: 65,
      lastUpdate: '2023-06-10',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
      id: '2',
      title: 'Urban Loft Renovation',
      status: 'Planning',
      progress: 25,
      lastUpdate: '2023-06-05',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1153&q=80',
    }
  ];

  // Mock notifications
  const notifications = [
    {
      id: '1',
      type: 'message',
      content: 'Nouveau message de Sophie Laurent concernant la sélection des matériaux',
      time: '2 heures',
      read: false
    },
    {
      id: '2',
      type: 'update',
      content: 'Le rapport hebdomadaire pour Eco Harmony Villa est disponible',
      time: '1 jour',
      read: true
    },
    {
      id: '3',
      type: 'document',
      content: 'Nouveaux plans téléversés pour votre révision',
      time: '3 jours',
      read: true
    }
  ];

  return (
    <div className="bg-offwhite min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-5 md:px-[5%]">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="mb-2">{t('dashboard.title')}</h1>
            <p className="text-gray-600">{t('dashboard.welcome')} {user?.name}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center text-gray-600 hover:text-[#A47B67] transition-colors duration-300 mt-4 md:mt-0"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t('dashboard.signOut')}
          </button>
        </div>

        {/* Dashboard Navigation */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <nav className="flex flex-wrap">
            <button 
              className={`flex items-center px-4 py-2 ${activeSection === 'dashboard' ? 'text-[#A47B67] border-b-2 border-[#A47B67]' : 'text-gray-600 hover:text-[#A47B67]'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <Home className="h-5 w-5 mr-2" />
              <span>{t('dashboard.nav.dashboard')}</span>
            </button>
            <button 
              className={`flex items-center px-4 py-2 ${activeSection === 'documents' ? 'text-[#A47B67] border-b-2 border-[#A47B67]' : 'text-gray-600 hover:text-[#A47B67]'}`}
              onClick={() => setActiveSection('documents')}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>{t('dashboard.nav.documents')}</span>
            </button>
            <button 
              className={`flex items-center px-4 py-2 ${activeSection === 'messages' ? 'text-[#A47B67] border-b-2 border-[#A47B67]' : 'text-gray-600 hover:text-[#A47B67]'}`}
              onClick={() => setActiveSection('messages')}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>Messages</span>
            </button>
            {isAdmin && (
              <button 
                className={`flex items-center px-4 py-2 ${activeSection === 'blog' ? 'text-[#A47B67] border-b-2 border-[#A47B67]' : 'text-gray-600 hover:text-[#A47B67]'}`}
                onClick={() => setActiveSection('blog')}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                <span>Blog</span>
              </button>
            )}
            <button 
              className={`flex items-center px-4 py-2 ${activeSection === 'settings' ? 'text-[#A47B67] border-b-2 border-[#A47B67]' : 'text-gray-600 hover:text-[#A47B67]'}`}
              onClick={() => setActiveSection('settings')}
            >
              <Settings className="h-5 w-5 mr-2" />
              <span>{t('dashboard.nav.settings')}</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        {activeSection === 'messages' && (
          <div className="col-span-3">
            <ChatInterface currentUserId="current-user" />
          </div>
        )}
        {activeSection === 'documents' && (
          <div className="col-span-3">
            <DocumentsInterface />
          </div>
        )}
        {activeSection === 'settings' && (
          <div className="col-span-3">
            <SettingsInterface user={mockUser} />
          </div>
        )}
        {activeSection === 'blog' && isAdmin && (
          <div className="col-span-3">
            <AdminBlogInterface />
          </div>
        )}
        {activeSection === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects Section */}
            <div className="lg:col-span-2">
              <h2 className="mb-6">{t('dashboard.projects')}</h2>
              <div className="space-y-6">
                {clientProjects.map((project) => (
                  <motion.div 
                    key={project.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      <div className="aspect-[16/9] md:aspect-auto overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:col-span-2">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-playfair text-xl">{project.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                            project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{t('dashboard.progress')}</span>
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#A47B67] h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t('dashboard.lastUpdated')} {project.lastUpdate}</span>
                          <Link 
                            to={`/client/project/${project.id}`}
                            className="text-[#A47B67] hover:text-[#8B6754] transition-colors duration-300"
                          >
                            {t('dashboard.viewDetails')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Notifications */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="font-playfair text-xl mb-4">{t('dashboard.notifications')}</h3>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-[#A47B67] bg-opacity-10 border-l-4 border-[#A47B67]'}`}
                      >
                        <p className={`${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">{t('dashboard.noNotifications')}</p>
                )}
                <button className="text-[#A47B67] hover:text-[#8B6754] transition-colors duration-300 text-sm mt-4">
                  {t('dashboard.viewAllNotifications')}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-playfair text-xl mb-4">{t('dashboard.quickLinks')}</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-[#A47B67] hover:text-[#8B6754] transition-colors duration-300">
                      {t('dashboard.quickLink1')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#A47B67] hover:text-[#8B6754] transition-colors duration-300">
                      {t('dashboard.quickLink2')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#A47B67] hover:text-[#8B6754] transition-colors duration-300">
                      {t('dashboard.quickLink3')}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[#A47B67] hover:text-[#8B6754] transition-colors duration-300">
                      {t('dashboard.quickLink4')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboardPage;