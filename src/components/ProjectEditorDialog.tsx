import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, AlertCircle, Calendar, User, FileText, MapPin, Plus, Trash, Upload, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface SustainableFeature {
  id: string;
  name: string;
  description?: string;
}

interface ProjectGalleryImage {
  id?: string;
  image_url: string;
  caption?: string;
  display_order: number;
}

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

interface ProjectEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSaved: () => void;
  project?: Project;
  clients: Client[];
}

const ProjectEditorDialog: React.FC<ProjectEditorDialogProps> = ({ 
  isOpen, 
  onClose, 
  onProjectSaved, 
  project,
  clients 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    challenge: '',
    solution: '',
    location: '',
    project_type: 'résidentiel',
    client_id: '',
    status: 'draft',
    start_date: '',
    end_date: '',
    featured: false,
    main_image: '',
    year_completed: new Date().getFullYear().toString()
  });
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<SustainableFeature[]>([]);
  const [galleryImages, setGalleryImages] = useState<ProjectGalleryImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const statuses = [
    { id: 'draft', name: 'Brouillon' },
    { id: 'in_progress', name: 'En cours' },
    { id: 'completed', name: 'Terminé' },
    { id: 'on_hold', name: 'En pause' },
    { id: 'cancelled', name: 'Annulé' }
  ];

  const projectTypes = [
    { id: 'résidentiel', name: 'Résidentiel' },
    { id: 'professionnel', name: 'Professionnel' }
  ];

  // Charger les caractéristiques clés disponibles
  const loadSustainableFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('sustainable_features')
        .select('*')
        .order('name');

      if (error) throw error;
      setAvailableFeatures(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des caractéristiques:', error);
    }
  };

  // Charger les données du projet si en mode édition
  const loadProjectData = async () => {
    if (!project) return;

    try {
      // Charger les caractéristiques du projet
      const { data: projectFeatures } = await supabase
        .from('project_features')
        .select('feature_id')
        .eq('project_id', project.id);

      if (projectFeatures) {
        setSelectedFeatures(projectFeatures.map(pf => pf.feature_id));
      }

      // Charger la galerie du projet
      const { data: gallery } = await supabase
        .from('project_gallery')
        .select('*')
        .eq('project_id', project.id)
        .order('display_order');

      if (gallery) {
        setGalleryImages(gallery);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données du projet:', error);
    }
  };

  useEffect(() => {
    loadSustainableFeatures();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        challenge: project.challenge || '',
        solution: project.solution || '',
        location: project.location || '',
        project_type: project.project_type || 'résidentiel',
        client_id: project.client_id || '',
        status: project.status,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        featured: project.featured || false,
        main_image: project.main_image || '',
        year_completed: project.year_completed || new Date().getFullYear().toString()
      });
      loadProjectData();
    } else {
      resetForm();
    }
  }, [project]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      challenge: '',
      solution: '',
      location: '',
      project_type: 'résidentiel',
      client_id: '',
      status: 'draft',
      start_date: '',
      end_date: '',
      featured: false,
      main_image: '',
      year_completed: new Date().getFullYear().toString()
    });
    setSelectedFeatures([]);
    setGalleryImages([]);
    setNewImageUrl('');
    setNewImageCaption('');
    setError('');
    setSuccess('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const addGalleryImage = () => {
    if (newImageUrl.trim()) {
      const newImage: ProjectGalleryImage = {
        image_url: newImageUrl.trim(),
        caption: newImageCaption.trim() || undefined,
        display_order: galleryImages.length
      };
      setGalleryImages(prev => [...prev, newImage]);
      setNewImageUrl('');
      setNewImageCaption('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return false;
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate < startDate) {
        setError('La date de fin doit être postérieure à la date de début');
        return false;
      }
    }

    return true;
  };

  const isUrgent = () => {
    if (!formData.end_date) return false;
    const endDate = new Date(formData.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0; // Urgent si dans les 7 jours
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Préparer les données pour Supabase
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        challenge: formData.challenge.trim() || null,
        solution: formData.solution.trim() || null,
        location: formData.location.trim() || null,
        project_type: formData.project_type,
        client_id: formData.client_id || null,
        status: formData.status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        featured: formData.featured,
        main_image: formData.main_image.trim() || null,
        year_completed: formData.year_completed || null
      };

      let projectId = project?.id;

      if (project) {
        // Mise à jour d'un projet existant
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);

        if (error) throw error;
      } else {
        // Création d'un nouveau projet
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single();

        if (error) throw error;
        projectId = data.id;
      }

      // Gérer les caractéristiques clés
      if (projectId) {
        // Supprimer les anciennes associations
        await supabase
          .from('project_features')
          .delete()
          .eq('project_id', projectId);

        // Ajouter les nouvelles associations
        if (selectedFeatures.length > 0) {
          const featureInserts = selectedFeatures.map(featureId => ({
            project_id: projectId,
            feature_id: featureId
          }));

          await supabase
            .from('project_features')
            .insert(featureInserts);
        }

        // Gérer la galerie d'images
        // Supprimer les anciennes images
        await supabase
          .from('project_gallery')
          .delete()
          .eq('project_id', projectId);

        // Ajouter les nouvelles images
        if (galleryImages.length > 0) {
          const galleryInserts = galleryImages.map((img, index) => ({
            project_id: projectId,
            image_url: img.image_url,
            caption: img.caption || null,
            display_order: index
          }));

          await supabase
            .from('project_gallery')
            .insert(galleryInserts);
        }
      }

      setSuccess(project ? 'Projet mis à jour avec succès' : 'Projet créé avec succès');

      // Fermer le dialog après un délai
      setTimeout(() => {
        onProjectSaved();
        resetForm();
      }, 1500);

    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const getSelectedFeaturesText = () => {
    if (selectedFeatures.length === 0) return 'Sélectionner des caractéristiques...';
    if (selectedFeatures.length === 1) {
      const feature = availableFeatures.find(f => f.id === selectedFeatures[0]);
      return feature?.name || '';
    }
    return `${selectedFeatures.length} caractéristiques sélectionnées`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-6"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {project ? 'Modifier le projet' : 'Nouveau projet'}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Messages d'erreur et de succès */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {error}
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Titre du projet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du projet *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                          placeholder="Nom du projet"
                        />
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                    </div>

                    {/* Type de projet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de projet
                      </label>
                      <select
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      >
                        {projectTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      placeholder="Description du projet..."
                    />
                  </div>

                  {/* Le défi et Notre solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Le défi
                      </label>
                      <textarea
                        name="challenge"
                        value={formData.challenge}
                        onChange={handleInputChange}
                        rows={4}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                        placeholder="Décrivez le défi principal de ce projet..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notre solution
                      </label>
                      <textarea
                        name="solution"
                        value={formData.solution}
                        onChange={handleInputChange}
                        rows={4}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                        placeholder="Décrivez la solution apportée..."
                      />
                    </div>
                  </div>

                  {/* Emplacement et Année */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emplacement
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                          placeholder="Ville, Pays"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Année de réalisation
                      </label>
                      <input
                        type="text"
                        name="year_completed"
                        value={formData.year_completed}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  {/* Image principale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image principale
                    </label>
                    <input
                      type="url"
                      name="main_image"
                      value={formData.main_image}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Client et Statut */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client
                      </label>
                      <div className="relative">
                        <select
                          name="client_id"
                          value={formData.client_id}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50 appearance-none"
                        >
                          <option value="">Aucun client assigné</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>
                              {client.name} ({client.email})
                            </option>
                          ))}
                        </select>
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      >
                        {statuses.map(status => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin prévue
                        {isUrgent() && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            URGENT
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50 ${
                            isUrgent() ? 'border-red-500 text-red-600' : ''
                          }`}
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {/* Publication sur page projet */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="mr-3 text-sage focus:ring-sage"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Publication sur la page Projets (mettre en avant)
                    </label>
                  </div>

                  {/* Caractéristiques clés - Liste déroulante multi-sélective */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Caractéristiques clés
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsFeatureDropdownOpen(!isFeatureDropdownOpen)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage bg-white text-left flex items-center justify-between"
                        disabled={isLoading}
                      >
                        <span className="text-gray-700">
                          {getSelectedFeaturesText()}
                        </span>
                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isFeatureDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isFeatureDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {availableFeatures.map(feature => (
                            <label key={feature.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedFeatures.includes(feature.id)}
                                onChange={() => handleFeatureToggle(feature.id)}
                                className="mr-3 text-sage focus:ring-sage"
                              />
                              <div>
                                <span className="text-sm font-medium">{feature.name}</span>
                                {feature.description && (
                                  <p className="text-xs text-gray-500">{feature.description}</p>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Affichage des caractéristiques sélectionnées */}
                    {selectedFeatures.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedFeatures.map(featureId => {
                          const feature = availableFeatures.find(f => f.id === featureId);
                          return feature ? (
                            <span
                              key={featureId}
                              className="inline-flex items-center px-3 py-1 bg-sage bg-opacity-10 text-sage rounded-full text-sm"
                            >
                              {feature.name}
                              <button
                                type="button"
                                onClick={() => handleFeatureToggle(featureId)}
                                className="ml-2 text-sage hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Galerie de photos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Galerie de photos
                    </label>
                    
                    {/* Ajouter une nouvelle image */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="URL de l'image"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={newImageCaption}
                            onChange={(e) => setNewImageCaption(e.target.value)}
                            placeholder="Légende (optionnel)"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addGalleryImage}
                        className="mt-2 flex items-center px-3 py-2 bg-sage text-white rounded-lg hover:bg-opacity-90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter l'image
                      </button>
                    </div>

                    {/* Liste des images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryImages.map((image, index) => (
                        <div key={index} className="relative border rounded-lg p-3">
                          <img
                            src={image.image_url}
                            alt={image.caption || `Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          {image.caption && (
                            <p className="text-sm text-gray-600 mb-2">{image.caption}</p>
                          )}
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-sage rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Enregistrement...' : (project ? 'Mettre à jour' : 'Créer')}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectEditorDialog;