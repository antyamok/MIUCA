import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, AlertTriangle, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProjectEditorDialog from './ProjectEditorDialog';

interface Project {
  id: string;
  title: string;
  description?: string;
  challenge?: string;
  solution?: string;
  location?: string;
  project_type?: string;
  client_id?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  featured?: boolean;
  main_image?: string;
  year_completed?: string;
  created_at: string;
  client?: {
    name: string;
    email: string;
  };
}

interface Client {
  id: string;
  name: string;
  email: string;
}

const AdminProjectInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const statuses = [
    { id: 'all', name: 'Tous les statuts' },
    { id: 'draft', name: 'Brouillon' },
    { id: 'in_progress', name: 'En cours' },
    { id: 'completed', name: 'Terminé' },
    { id: 'on_hold', name: 'En pause' },
    { id: 'cancelled', name: 'Annulé' }
  ];

  // Charger les projets depuis Supabase
  const loadProjects = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des projets:', error);
      setError('Impossible de charger les projets');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les clients pour le sélecteur
  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('archived', false)
        .order('name');

      if (error) {
        throw error;
      }

      setClients(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des clients:', error);
    }
  };

  useEffect(() => {
    loadProjects();
    loadClients();
  }, []);

  // Filtrer les projets
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditorOpen(true);
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action supprimera également toutes les images et caractéristiques associées.')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);

        if (error) {
          throw error;
        }

        // Recharger la liste des projets
        loadProjects();
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        setError('Impossible de supprimer le projet');
      }
    }
  };

  const handleNewProject = () => {
    setSelectedProject(undefined);
    setIsEditorOpen(true);
  };

  const handleProjectSaved = () => {
    loadProjects();
    setIsEditorOpen(false);
    setSelectedProject(undefined);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusObj = statuses.find(s => s.id === status);
    return statusObj ? statusObj.name : status;
  };

  const isUrgent = (endDate?: string) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0; // Urgent si dans les 7 jours
  };

  const isOverdue = (endDate?: string) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const today = new Date();
    return end < today;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-playfair mb-2">Gestion des Projets</h2>
          <p className="text-gray-600">Gérez vos projets et réalisations</p>
        </div>
        <button 
          className="btn-primary flex items-center"
          onClick={handleNewProject}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Projet
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un projet..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage appearance-none bg-white"
        >
          {statuses.map(status => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des projets */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sage"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="border rounded-lg p-4 hover:border-sage transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-lg mr-2">{project.title}</h3>
                        {project.featured && (
                          <Star className="h-5 w-5 text-yellow-500 fill-current" title="Mis en avant sur la page Projets" />
                        )}
                        {isUrgent(project.end_date) && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            URGENT
                          </span>
                        )}
                        {isOverdue(project.end_date) && (
                          <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            EN RETARD
                          </span>
                        )}
                      </div>
                      
                      {project.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {project.description}
                        </p>
                      )}

                      {project.location && (
                        <p className="text-gray-500 text-sm mb-2">
                          📍 {project.location}
                        </p>
                      )}

                      {project.project_type && (
                        <span className="inline-block px-2 py-1 bg-sage bg-opacity-10 text-sage text-xs rounded-full mr-2">
                          {project.project_type}
                        </span>
                      )}
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {project.client && (
                      <>
                        <span>Client: {project.client.name}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>Créé le {formatDate(project.created_at)}</span>
                    {project.start_date && (
                      <>
                        <span>•</span>
                        <span>Début: {formatDate(project.start_date)}</span>
                      </>
                    )}
                    {project.end_date && (
                      <>
                        <span>•</span>
                        <span className={isUrgent(project.end_date) || isOverdue(project.end_date) ? 'text-red-600 font-medium' : ''}>
                          Fin prévue: {formatDate(project.end_date)}
                        </span>
                      </>
                    )}
                    {project.year_completed && (
                      <>
                        <span>•</span>
                        <span>Année: {project.year_completed}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button 
                    className="p-2 text-sage hover:text-terracotta transition-colors duration-300"
                    onClick={() => handleEdit(project)}
                    title="Modifier"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                    onClick={() => handleDelete(project.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredProjects.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Modifiez vos filtres ou créez un nouveau projet'
                  : 'Créez votre premier projet'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Éditeur de projet */}
      <ProjectEditorDialog
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedProject(undefined);
        }}
        onProjectSaved={handleProjectSaved}
        project={selectedProject}
        clients={clients}
      />
    </div>
  );
};

export default AdminProjectInterface;