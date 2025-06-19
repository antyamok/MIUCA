import React, { useState, useEffect } from 'react';
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
import { supabase } from '../lib/supabase';
import ChatInterface from '../components/ChatInterface';
import DocumentsInterface from '../components/DocumentsInterface';
import SettingsInterface from '../components/SettingsInterface';

type ActiveTab = 'dashboard' | 'documents' | 'messages' | 'settings';

interface ClientProject {
  id: string;
  title: string;
  status: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  project_type?: string;
  location?: string;
}

const ClientDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les projets du client depuis Supabase
  const loadClientProjects = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des projets:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClientProjects();
  }, [user?.id]);

  // Calculer le pourcentage de progression basé sur le statut
  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'draft':
        return 10;
      case 'in_progress':
        return 65;
      case 'completed':
        return 100;
      case 'on_hold':
        return 45;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  // Obtenir le libellé du statut en français
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'on_hold':
        return 'En pause';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  // Données de démonstration pour les notifications
  const notifications = [
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
  ];

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Projets du client */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-playfair mb-4">{t('dashboard.projects')}</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sage"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
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
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    )}
                    {project.location && (
                      <p className="text-sm text-gray-500 mt-1">📍 {project.location}</p>
                    )}
                    {project.project_type && (
                      <span className="inline-block px-2 py-1 bg-sage bg-opacity-10 text-sage text-xs rounded-full mt-2">
                        {project.project_type}
                      </span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('dashboard.progress')}</span>
                    <span>{getProgressPercentage(project.status)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sage h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(project.status)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span>Créé le {formatDate(project.created_at)}</span>
                    {project.start_date && (
                      <span> • Début: {formatDate(project.start_date)}</span>
                    )}
                    {project.end_date && (
                      <span> • Fin prévue: {formatDate(project.end_date)}</span>
                    )}
                  </div>
                  <button className="text-sage hover:text-terracotta transition-colors duration-300 text-sm font-medium">
                    {t('dashboard.viewDetails')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <FolderOpen className="h-16 w-16 mx-auto" />
            </div>
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              Aucun projet en cours
            </h4>
            <p className="text-gray-500">
              Vos projets apparaîtront ici une fois qu'ils seront créés par notre équipe.
            </p>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-playfair mb-4">{t('dashboard.notifications')}</h3>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
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