import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Star, Eye, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BlogEditorDialog from './BlogEditorDialog';

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
  author?: {
    name?: string;
    email: string;
  };
}

interface Admin {
  id: string;
  name?: string;
  email: string;
}

const AdminBlogInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | undefined>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'Design Durable', name: 'Design Durable' },
    { id: 'Matériaux Écologiques', name: 'Matériaux Écologiques' },
    { id: 'Vie Écologique', name: 'Vie Écologique' },
    { id: 'Tendances Architecture', name: 'Tendances Architecture' },
    { id: 'Innovation', name: 'Innovation' },
    { id: 'Conseils', name: 'Conseils' }
  ];

  const statuses = [
    { id: 'all', name: 'Tous les statuts' },
    { id: 'draft', name: 'Brouillon' },
    { id: 'published', name: 'Publié' },
    { id: 'archived', name: 'Archivé' }
  ];

  // Charger les articles depuis Supabase
  const loadPosts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:admins(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPosts(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des articles:', error);
      setError('Impossible de charger les articles');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les administrateurs pour le sélecteur d'auteur
  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, name, email')
        .order('name');

      if (error) {
        throw error;
      }

      setAdmins(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des administrateurs:', error);
    }
  };

  useEffect(() => {
    loadPosts();
    loadAdmins();
  }, []);

  // Filtrer les articles
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditorOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);

        if (error) {
          throw error;
        }

        // Recharger la liste des articles
        loadPosts();
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        setError('Impossible de supprimer l\'article');
      }
    }
  };

  const handleNewPost = () => {
    setSelectedPost(undefined);
    setIsEditorOpen(true);
  };

  const handlePostSaved = () => {
    loadPosts();
    setIsEditorOpen(false);
    setSelectedPost(undefined);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusObj = statuses.find(s => s.id === status);
    return statusObj ? statusObj.name : status;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-playfair mb-2">Gestion du Blog</h2>
          <p className="text-gray-600">Gérez vos articles et publications</p>
        </div>
        <button 
          className="btn-primary flex items-center"
          onClick={handleNewPost}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Article
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un article..."
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

      {/* Liste des articles */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sage"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              className="border rounded-lg p-4 hover:border-sage transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-4">
                {/* Image de couverture */}
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-lg mr-2">{post.title}</h3>
                        {post.featured && (
                          <Star className="h-5 w-5 text-yellow-500 fill-current" title="Article en vedette" />
                        )}
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.created_at)}
                        </span>
                        {post.author && (
                          <span>Par {post.author.name || post.author.email}</span>
                        )}
                        {post.reading_time && (
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.reading_time} min de lecture
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-terracotta">{post.category}</span>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex space-x-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                        {getStatusLabel(post.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-sage hover:text-terracotta transition-colors duration-300"
                    onClick={() => handleEdit(post)}
                    title="Modifier"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button 
                    className="p-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                    onClick={() => handleDelete(post.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPosts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                  ? 'Modifiez vos filtres ou créez un nouvel article'
                  : 'Créez votre premier article'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Éditeur d'article */}
      <BlogEditorDialog
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedPost(undefined);
        }}
        onPostSaved={handlePostSaved}
        post={selectedPost}
        admins={admins}
      />
    </div>
  );
};

export default AdminBlogInterface;