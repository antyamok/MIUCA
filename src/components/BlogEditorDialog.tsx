import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Image as ImageIcon, AlertCircle, Tag, User, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  author_id?: string;
  status: string;
  featured?: boolean;
  slug?: string;
  published_at?: string;
  reading_time?: number;
  created_at: string;
}

interface Admin {
  id: string;
  name?: string;
  email: string;
}

interface BlogEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSaved: () => void;
  post?: BlogPost;
  admins: Admin[];
}

const BlogEditorDialog: React.FC<BlogEditorDialogProps> = ({ 
  isOpen, 
  onClose, 
  onPostSaved, 
  post,
  admins 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Design Durable',
    featured_image: '',
    author_id: '',
    status: 'draft',
    featured: false,
    slug: ''
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Design Durable',
    'Matériaux Écologiques',
    'Vie Écologique',
    'Tendances Architecture',
    'Innovation',
    'Conseils'
  ];

  const statuses = [
    { id: 'draft', name: 'Brouillon' },
    { id: 'published', name: 'Publié' },
    { id: 'archived', name: 'Archivé' }
  ];

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        category: post.category || 'Design Durable',
        featured_image: post.featured_image || '',
        author_id: post.author_id || '',
        status: post.status,
        featured: post.featured || false,
        slug: post.slug || ''
      });
      setTags(post.tags || []);
    } else {
      resetForm();
    }
  }, [post]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'Design Durable',
      featured_image: '',
      author_id: '',
      status: 'draft',
      featured: false,
      slug: ''
    });
    setTags([]);
    setNewTag('');
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
      
      // Auto-générer le slug à partir du titre
      if (name === 'title') {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return false;
    }

    if (!formData.content.trim()) {
      setError('Le contenu est requis');
      return false;
    }

    if (!formData.excerpt.trim()) {
      setError('L\'extrait est requis');
      return false;
    }

    return true;
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
      const readingTime = calculateReadingTime(formData.content);
      
      // Préparer les données pour Supabase
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        tags: tags.length > 0 ? tags : null,
        featured_image: formData.featured_image.trim() || null,
        author_id: formData.author_id || null,
        status: formData.status,
        featured: formData.featured,
        slug: formData.slug.trim() || null,
        reading_time: readingTime,
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      if (post) {
        // Mise à jour d'un article existant
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;
        setSuccess('Article mis à jour avec succès');
      } else {
        // Création d'un nouvel article
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        setSuccess('Article créé avec succès');
      }

      // Fermer le dialog après un délai
      setTimeout(() => {
        onPostSaved();
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
                    {post ? 'Modifier l\'article' : 'Nouvel article'}
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

                  {/* Titre et Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre de l'article *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                        placeholder="Titre de l'article"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                        placeholder="url-de-l-article"
                      />
                    </div>
                  </div>

                  {/* Extrait */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extrait *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      disabled={isLoading}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      placeholder="Résumé de l'article..."
                    />
                  </div>

                  {/* Contenu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={12}
                      required
                      disabled={isLoading}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      placeholder="Contenu de l'article..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Temps de lecture estimé: {calculateReadingTime(formData.content)} min
                    </p>
                  </div>

                  {/* Image de couverture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image de couverture
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        name="featured_image"
                        value={formData.featured_image}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                        placeholder="https://example.com/image.jpg"
                      />
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>

                  {/* Catégorie, Auteur et Statut */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auteur
                      </label>
                      <div className="relative">
                        <select
                          name="author_id"
                          value={formData.author_id}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50 appearance-none"
                        >
                          <option value="">Sélectionner un auteur</option>
                          {admins.map(admin => (
                            <option key={admin.id} value={admin.id}>
                              {admin.name || admin.email}
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

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    
                    {/* Ajouter un nouveau tag */}
                    <div className="flex space-x-2 mb-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          placeholder="Ajouter un tag..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      </div>
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-opacity-90"
                      >
                        Ajouter
                      </button>
                    </div>

                    {/* Liste des tags */}
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-sage bg-opacity-10 text-sage rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-sage hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Article en vedette */}
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
                      Article en vedette (mettre en avant sur la page d'accueil)
                    </label>
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
                      {isLoading ? 'Enregistrement...' : (post ? 'Mettre à jour' : 'Publier')}
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

export default BlogEditorDialog;