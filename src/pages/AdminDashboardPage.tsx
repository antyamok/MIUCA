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
  Search,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminProjectInterface from '../components/AdminProjectInterface';
import AdminBlogInterface from '../components/AdminBlogInterface';
import AdminClientInterface from '../components/AdminClientInterface';
import ChatInterface from '../components/ChatInterface';
import DocumentsInterface from '../components/DocumentsInterface';
import SettingsInterface from '../components/SettingsInterface';

type ActiveTab = 'dashboard' | 'projects' | 'blog' | 'clients' | 'messages' | 'documents' | 'settings';

const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Données de démonstration pour le tableau de bord
  const dashboardStats = {
    totalProjects: 12,
    activeProjects: 8,
    totalClients: 24,
    pendingTasks: 6,
    recentActivity: [
      {
        id: '1',
        type: 'project_update',
        message: 'Projet Eco Harmony Villa - Phase 3 terminée',
        time: '2 heures',
        user: 'Sophie Laurent'
      },
      {
        id: '2',
        type: 'new_client',
        message: 'Nouveau client inscrit: Marie Dubois',
        time: '4 heures',
        user: 'Système'
      },
      {
        id: '3',
        type: 'document_upload',
        message: 'Plans finaux téléversés pour Urban Loft',
        time: '6 heures',
        user: 'Marc Dubois'
      }
    ],
    upcomingDeadlines: [
      {
        id: '1',
        project: 'Eco Harmony Villa',
        task: 'Livraison finale',
        date: '2024-01-15',
        priority: 'high'
      },
      {
        id: '2',
        project: 'Urban Loft Renovation',
        task: 'Révision des plans',
        date: '2024-01-20',
        priority: 'medium'
      }
    ]
  };

  const handleLogout = () => {
    logout();
  };

  const renderDashboardOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projets Totaux</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProjects}</p>
            </div>
            <div className="p-3 bg-sage bg-opacity-10 rounded-full">
              <FolderOpen className="h-6 w-6 text-sage" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeProjects}</p>
            </div>
            <div className="p-3 bg-terracotta bg-opacity-10 rounded-full">
              <TrendingUp className="h-6 w-6 text-terracotta" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients Totaux</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalClients}</p>
            </div>
            <div className="p-3 bg-accent bg-opacity-10 rounded-full">
              <Users className="h-6 w-6 text-accent" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tâches en Attente</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingTasks}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-playfair mb-4">Activité Récente</h3>
          <div className="space-y-4">
            {dashboardStats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-sage rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">Il y a {activity.time} • {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-playfair mb-4">Échéances Prochaines</h3>
          <div className="space-y-4">
            {dashboardStats.upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{deadline.project}</p>
                  <p className="text-sm text-gray-600">{deadline.task}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{deadline.date}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                    deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {deadline.priority === 'high' ? 'Urgent' :
                     deadline.priority === 'medium' ? 'Moyen' : 'Faible'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'projects':
        return <AdminProjectInterface />;
      case 'blog':
        return <AdminBlogInterface />;
      case 'clients':
        return <AdminClientInterface />;
      case 'messages':
        return <ChatInterface currentUserId={user?.id || ''} />;
      case 'documents':
        return <DocumentsInterface />;
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
            <h1 className="mb-2">Tableau de Bord Administrateur</h1>
            <p className="text-gray-600">Bienvenue, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <button className="relative p-2 text-gray-600 hover:text-sage transition-colors duration-300">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-300"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
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
                  Tableau de Bord
                </button>
                
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'projects'
                      ? 'bg-sage text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FolderOpen className="h-5 w-5 mr-3" />
                  Gestion Projets
                </button>
                
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'blog'
                      ? 'bg-sage text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Gestion Blog
                </button>
                
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeTab === 'clients'
                      ? 'bg-sage text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <UserPlus className="h-5 w-5 mr-3" />
                  Gestion Clients
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
                  Messagerie
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
                  Documents
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
                  Paramètres
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

export default AdminDashboardPage;