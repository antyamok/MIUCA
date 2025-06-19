import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Clock, 
  Folder, 
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  User,
  Calendar
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  client_id?: string;
  project_id?: string;
  description?: string;
  category: string;
  created_at: string;
  uploader?: {
    name?: string;
    email: string;
  };
  client?: {
    name: string;
    email: string;
  };
  project?: {
    title: string;
  };
}

interface Project {
  id: string;
  title: string;
}

const DocumentsInterface: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadProjectId, setUploadProjectId] = useState('');

  const categories = [
    { id: 'all', name: 'Tous les documents' },
    { id: 'general', name: 'Général' },
    { id: 'plans', name: 'Plans' },
    { id: 'contracts', name: 'Contrats' },
    { id: 'invoices', name: 'Factures' },
    { id: 'photos', name: 'Photos' },
    { id: 'reports', name: 'Rapports' }
  ];

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  // Charger les documents
  const loadDocuments = async () => {
    setIsLoading(true);
    setError('');

    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          uploader:uploaded_by(name, email),
          client:clients(name, email),
          project:projects(title)
        `)
        .order('created_at', { ascending: false });

      // Si c'est un client, ne charger que ses documents
      if (!isAdmin && user?.id) {
        query = query.eq('client_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setDocuments(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des documents:', error);
      setError('Impossible de charger les documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les projets pour le sélecteur
  const loadProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select('id, title')
        .order('title');

      // Si c'est un client, ne charger que ses projets
      if (!isAdmin && user?.id) {
        query = query.eq('client_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadProjects();
  }, [user?.id, isAdmin]);

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploader?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesProject = selectedProject === 'all' || doc.project_id === selectedProject;
    
    return matchesSearch && matchesCategory && matchesProject;
  });

  // Valider les fichiers
  const validateFiles = (files: FileList): string | null => {
    let totalSize = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Vérifier le type de fichier
      if (!ALLOWED_TYPES.includes(file.type)) {
        return `Le fichier "${file.name}" n'est pas d'un type autorisé.`;
      }
      
      totalSize += file.size;
    }
    
    // Vérifier la taille totale
    if (totalSize > MAX_FILE_SIZE) {
      return `La taille totale des fichiers (${(totalSize / 1024 / 1024).toFixed(1)}MB) dépasse la limite de 25MB.`;
    }
    
    return null;
  };

  // Téléverser les fichiers
  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Veuillez sélectionner au moins un fichier');
      return;
    }

    const validationError = validateFiles(selectedFiles);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file, index) => {
        // Créer un nom de fichier unique
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}_${index}.${fileExt}`;

        // Téléverser vers Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        // Enregistrer les métadonnées dans la base de données
        const { error: dbError } = await supabase
          .from('documents')
          .insert({
            filename: fileName,
            original_filename: file.name,
            file_path: fileName,
            file_size: file.size,
            file_type: file.type,
            uploaded_by: user?.id,
            client_id: isAdmin ? null : user?.id,
            project_id: uploadProjectId || null,
            description: uploadDescription || null,
            category: uploadCategory
          });

        if (dbError) {
          throw dbError;
        }

        // Mettre à jour la progression
        setUploadProgress(((index + 1) / selectedFiles.length) * 100);
      });

      await Promise.all(uploadPromises);

      setSuccess(`${selectedFiles.length} fichier(s) téléversé(s) avec succès`);
      setShowUploadDialog(false);
      setSelectedFiles(null);
      setUploadDescription('');
      setUploadCategory('general');
      setUploadProjectId('');
      loadDocuments();

    } catch (error: any) {
      console.error('Erreur lors du téléversement:', error);
      setError('Erreur lors du téléversement: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Télécharger un fichier
  const handleDownload = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_path);

      if (error) {
        throw error;
      }

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.original_filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      setError('Impossible de télécharger le fichier');
    }
  };

  // Supprimer un fichier
  const handleDelete = async (doc: Document) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${doc.original_filename}" ?`)) {
      return;
    }

    try {
      // Supprimer de la base de données
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) {
        throw dbError;
      }

      // Supprimer du stockage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([doc.file_path]);

      if (storageError) {
        console.warn('Erreur lors de la suppression du fichier:', storageError);
      }

      setSuccess('Document supprimé avec succès');
      loadDocuments();

    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setError('Impossible de supprimer le document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return 'text-red-500';
    if (fileType.includes('word') || fileType.includes('document')) return 'text-blue-500';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'text-green-500';
    if (fileType.includes('image')) return 'text-purple-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-playfair mb-2">Documents</h2>
          <p className="text-gray-600">
            {isAdmin ? 'Gérez tous les documents clients' : 'Gérez vos documents de projet'}
          </p>
        </div>
        <button 
          className="btn-primary flex items-center"
          onClick={() => setShowUploadDialog(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Téléverser
        </button>
      </div>

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un document..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage appearance-none bg-white"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage appearance-none bg-white"
        >
          <option value="all">Tous les projets</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des documents */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sage"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <motion.div
              key={doc.id}
              className="border rounded-lg p-4 hover:border-sage transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`${getFileIcon(doc.file_type)}`}>
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{doc.original_filename}</h3>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(doc.created_at)}
                      </span>
                      {isAdmin && doc.client && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {doc.client.name}
                          </span>
                        </>
                      )}
                      {doc.project && (
                        <>
                          <span>•</span>
                          <span>Projet: {doc.project.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-sage hover:text-terracotta transition-colors duration-300"
                    onClick={() => handleDownload(doc)}
                    title="Télécharger"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  {(isAdmin || doc.uploaded_by === user?.id) && (
                    <button 
                      className="p-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                      onClick={() => handleDelete(doc)}
                      title="Supprimer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredDocuments.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Aucun document trouvé
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' || selectedProject !== 'all'
                  ? 'Modifiez vos filtres ou téléversez de nouveaux documents'
                  : 'Téléversez votre premier document'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Dialog de téléversement */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium">Téléverser des documents</h3>
              <button
                onClick={() => setShowUploadDialog(false)}
                disabled={isUploading}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Sélection de fichiers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichiers (max 25MB total)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  disabled={isUploading}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptés: PDF, Word, Excel, images, texte
                </p>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Projet */}
              {projects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projet (optionnel)
                  </label>
                  <select
                    value={uploadProjectId}
                    onChange={(e) => setUploadProjectId(e.target.value)}
                    disabled={isUploading}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  >
                    <option value="">Aucun projet spécifique</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnelle)
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  disabled={isUploading}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  placeholder="Description des documents..."
                />
              </div>

              {/* Barre de progression */}
              {isUploading && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Téléversement en cours...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sage h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 p-6 border-t">
              <button
                type="button"
                onClick={() => setShowUploadDialog(false)}
                disabled={isUploading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !selectedFiles}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Téléversement...' : 'Téléverser'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DocumentsInterface;