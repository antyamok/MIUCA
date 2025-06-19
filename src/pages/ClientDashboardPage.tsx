import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut,
  Bell,
  Calendar,
  Download,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ChatInterface from '../components/ChatInterface';
import DocumentsInterface from '../components/DocumentsInterface';
import SettingsInterface from '../components/SettingsInterface';

type ActiveTab = 'dashboard' | 'documents' | 'messages' | 'settings';

const ClientDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Données de démonstration pour le client
  const clientData = {
    projects: [
      {
        id: '1',
        title: 'Eco Harmony Villa',
        status: 'En cours',
        progress: 65,
        lastUpdate: '2024-01-10',
        nextMilestone: 'Finitions intérieures'
      }
    ],
    notifications: [
      {
        id: '1',
        message: 'Nouvelles photos ajoutées à votre galerie de projet',
        time: '2 heures',
        type: 'update'
      },
      {
        id: '2',
        message: 'Réunion planifiée pour demain à 14h',
        time: '1 jour',
        type: 'meeting'
      }
    ]
  };

  const handleLogout = () => {
    logout();
  };

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Projets du client */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-playfair mb-4">{t('dashboard.projects')}</h3>
        <div className="space-y-4">
          {clientData.projects.map((project) => (
            <motion.div
              key={project.id}
              className="border rounded-lg p-4 hover:border-sage transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-lg">{project.title}</h4>
                  <p className="text-sm text-gray-600">Prochaine étape: {project.nextMilestone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  project.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t('dashboard.progress')}</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-sage h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {t('dashboard.lastUpdated')} {project.lastUpdate}
                </span>
                <button className="text-sage hover:text-terracotta transition-colors duration-300 text-sm font-medium">
                  {t('dashboard.viewDetails')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-playfair mb-4">{t('dashboard.notifications')}</h3>
        <div className="space-y-3">
          {clientData.notifications.length > 0 ? (
            clientData.notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-sage rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">Il y a {notification.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">{t('dashboard.noNotifications')}</p>
          )}
        </div>
      </div>

      {/* Liens rapides */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-playfair mb-4">{t('dashboard.quickLinks')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center p-3 border rounded-lg hover:border-sage transition-colors duration-300">
            <Download className="h-5 w-5 mr-3 text-sage" />
            {t('dashboard.quickLink1')}
          </button>
          <button className="flex items-center p-3 border rounded-lg hover:border-sage transition-colors duration-300">
            <Calendar className="h-5 w-5 mr-3 text-sage" />
            {t('dashboard.quickLink2')}
          </button>
          <button className="flex items-center p-3 border rounded-lg hover:border-sage transition-colors duration-300">
            <Calendar className="h-5 w-5 mr-3 text-sage" />
            {t('dashboard.quickLink3')}
          </button>
          <button className="flex items-center p-3 border rounded-lg hover:border-sage transition-colors duration-300">
            <MessageSquare className="h-5 w-5 mr-3 text-sage" />
            {t('dashboard.quickLink4')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'documents':
        return <DocumentsInterface />;
      case 'messages':
        return <ChatInterface currentUserId={user?.id || ''} />;
      case 'settings':
        return <SettingsInterface user={{
          name: user?.name || '',
          email: user?.email || '',
          phone: '+33 6 12 34 56 78',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
        }} />;
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="bg-offwhite min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-5 md:px-[5%]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="mb-2">{t('dashboard.title')}</h1>
            <p className="text-gray-600">{t('dashboard.welcome')} {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="relative p-2 text-gray-600 hover:text-sage transition-colors duration-300">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-300"
            >
              <LogOut className="h-5 w-5 mr-2" />
              {t('dashboard.signOut')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'dashboard'
                      ? 'bg-sage text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  {t('dashboard.nav.dashboard')}
                </button>
                
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'documents'
                      ? 'bg-sage text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  {t('dashboard.nav.documents')}
                </button>
                
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'messages'
                      ? 'bg-sage text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  {t('dashboard.nav.messages')}
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'settings'
                      ? 'bg-sage text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  {t('dashboard.nav.settings')}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;