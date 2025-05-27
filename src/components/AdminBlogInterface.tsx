import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import BlogEditorDialog from './BlogEditorDialog';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  status: 'draft' | 'published';
  publishDate: string;
  author: string;
}

const AdminBlogInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | undefined>();

  // Données de démonstration
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: "L'Avenir de l'Architecture Durable dans les Environnements Urbains",
      excerpt: "Explorer comment la conception écologique transforme nos villes et crée des espaces urbains plus vivables.",
      content: "Contenu complet de l'article...",
      image: 'https://images.unsplash.com/photo-1518005068251-37900150dfca',
      category: 'Design Durable',
      status: 'published',
      publishDate: '2024-03-15',
      author: 'Sophie Laurent'
    },
    {
      id: '2',
      title: 'Matériaux de Construction Écologiques Innovants pour 2024',
      excerpt: 'Un guide complet des derniers matériaux durables qui révolutionnent l\'industrie de la construction.',
      content: "Contenu complet de l'article...",
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
      category: 'Matériaux Écologiques',
      status: 'draft',
      publishDate: '2024-03-14',
      author: 'Marc Dubois'
    }
  ];

  const categories = [
    { id: 'all', name: 'Toutes les catégories' },
    { id: 'design-durable', name: 'Design Durable' },
    { id: 'materiaux-ecologiques', name: 'Matériaux Écologiques' },
    { id: 'vie-ecologique', name: 'Vie Écologique' },
    { id: 'tendances', name: 'Tendances Architecture' }
  ];

  // Filtrer les articles
  const filteredPosts = blogPosts.filter(post => 
    (selectedCategory === 'all' || post.category === selectedCategory) &&
    (selectedStatus === 'all' || post.status === selectedStatus) &&
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditorOpen(true);
  };

  const handleDelete = (postId: string) => {
    // Ici, vous pouvez ajouter la logique pour supprimer l'article
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      console.log('Suppression de l\'article:', postId);
    }
  };

  const handleNewPost = () => {
    setSelectedPost(undefined);
    setIsEditorOpen(true);
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
          <option value="all">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
        </select>
      </div>

      {/* Liste des articles */}
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
              <img
                src={post.image}
                alt={post.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>Par {post.author}</span>
                      <span>•</span>
                      <span>{formatDate(post.publishDate)}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-sage hover:text-terracotta transition-colors duration-300"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button 
                      className="p-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-500">
              Modifiez vos filtres ou créez un nouvel article
            </p>
          </div>
        )}
      </div>

      {/* Éditeur d'article */}
      <BlogEditorDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};

export default AdminBlogInterface;