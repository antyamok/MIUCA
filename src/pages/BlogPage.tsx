import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import BlogCard from '../components/BlogCard';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  published_at?: string;
  created_at: string;
  status: string;
  author?: {
    name?: string;
    email: string;
  };
}

const BlogPage: React.FC = () => {
  const { t } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Catégories pour le filtrage
  const categories = [
    'Tous',
    'Design Durable',
    'Matériaux Écologiques',
    'Vie Écologique',
    'Tendances Architecture',
    'Innovation',
    'Conseils'
  ];
  
  const [activeCategory, setActiveCategory] = useState('Tous');

  // Charger les articles depuis Supabase
  const loadBlogPosts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          category,
          published_at,
          created_at,
          status,
          author:admins(name, email)
        `)
        .eq('status', 'published') // Seulement les articles publiés
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBlogPosts(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des articles:', error);
      setError('Impossible de charger les articles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogPosts();
  }, []);

  // Filtrer les articles en fonction de la catégorie active
  const filteredPosts = activeCategory === 'Tous' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Transformer les données pour le composant BlogCard
  const transformPostForCard = (post: BlogPost) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || 'Découvrez cet article passionnant sur l\'architecture durable.',
    image: post.featured_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    date: formatDate(post.published_at || post.created_at),
    category: post.category || 'Design Durable'
  });

  return (
    <div>
      <PageHeader 
        title="Notre Blog"
        subtitle="Idées, inspirations et conseils pour un mode de vie durable"
        backgroundImage="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      />

      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          {/* Filtre par catégorie */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-sage text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* État de chargement */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sage"></div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {/* Grille des articles */}
          {!isLoading && !error && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} {...transformPostForCard(post)} />
              ))}
            </motion.div>
          )}

          {/* État vide */}
          {!isLoading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-500">
                {activeCategory !== 'Tous' 
                  ? `Aucun article publié dans la catégorie "${activeCategory}".`
                  : 'Aucun article publié pour le moment.'
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;