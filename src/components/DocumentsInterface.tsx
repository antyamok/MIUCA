import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Filter, Clock, Folder } from 'lucide-react';
import UploadButton from './UploadButton';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  category: string;
  project: string;
  url: string;
}

const DocumentsInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  // Données de démonstration
  const documents: Document[] = [
    {
      id: '1',
      name: 'Plans_Final_V2.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Sophie Laurent',
      uploadDate: '2024-03-15',
      category: 'plans',
      project: 'Eco Harmony Villa',
      url: '#'
    },
    {
      id: '2',
      name: 'Devis_Materiaux.xlsx',
      type: 'Excel',
      size: '1.8 MB',
      uploadedBy: 'Marc Dubois',
      uploadDate: '2024-03-14',
      category: 'devis',
      project: 'Eco Harmony Villa',
      url: '#'
    },
    {
      id: '3',
      name: 'Rendu_3D_Salon.jpg',
      type: 'Image',
      size: '3.2 MB',
      uploadedBy: 'Sophie Laurent',
      uploadDate: '2024-03-13',
      category: 'rendus',
      project: 'Urban Loft Renovation',
      url: '#'
    },
    {
      id: '4',
      name: 'Contrat_Projet.pdf',
      type: 'PDF',
      size: '1.1 MB',
      uploadedBy: 'Elena Moretti',
      uploadDate: '2024-03-12',
      category: 'contrats',
      project: 'Urban Loft Renovation',
      url: '#'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous les documents' },
    { id: 'plans', name: 'Plans' },
    { id: 'devis', name: 'Devis' },
    { id: 'rendus', name: 'Rendus 3D' },
    { id: 'contrats', name: 'Contrats' }
  ];

  const projects = [
    { id: 'all', name: 'Tous les projets' },
    { id: 'eco-harmony', name: 'Eco Harmony Villa' },
    { id: 'urban-loft', name: 'Urban Loft Renovation' }
  ];

  // Filtrer et trier les documents
  const filteredDocuments = documents
    .filter(doc => 
      (selectedCategory === 'all' || doc.category === selectedCategory) &&
      (selectedProject === 'all' || doc.project === selectedProject) &&
      (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      return a.name.localeCompare(b.name);
    });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'text-red-500';
      case 'excel':
        return 'text-green-500';
      case 'image':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-playfair mb-2">Documents</h2>
          <p className="text-gray-600">Gérez vos documents et fichiers de projet</p>
        </div>
        <UploadButton />
      </div>

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage appearance-none bg-white"
        >
          <option value="date">Trier par date</option>
          <option value="name">Trier par nom</option>
        </select>
      </div>

      {/* Liste des documents */}
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
              <div className="flex items-center space-x-4">
                <div className={`${getFileIcon(doc.type)}`}>
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium">{doc.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>Par {doc.uploadedBy}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{formatDate(doc.uploadDate)}</span>
                <a
                  href={doc.url}
                  download
                  className="text-sage hover:text-terracotta transition-colors duration-300"
                >
                  <Download className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Aucun document trouvé
            </h3>
            <p className="text-gray-500">
              Modifiez vos filtres ou téléversez de nouveaux documents
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsInterface;