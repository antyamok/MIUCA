import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import BlogCard from '../components/BlogCard';
import { useLanguage } from '../contexts/LanguageContext';

const BlogPage: React.FC = () => {
  const { t } = useLanguage();
  
  // Catégories pour le filtrage
  const categories = [
    'Tous',
    'Design Durable',
    'Matériaux Écologiques',
    'Vie Écologique',
    'Tendances Architecture'
  ];
  
  const [activeCategory, setActiveCategory] = useState('Tous');

  // Données des articles de blog
  const blogPosts = [
    {
      id: '1',
      title: "L'Avenir de l'Architecture Durable dans les Environnements Urbains",
      excerpt: "Explorer comment la conception écologique transforme nos villes et crée des espaces urbains plus vivables.",
      image: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
      date: '15 juin 2023',
      category: 'Design Durable'
    },
    {
      id: '2',
      title: 'Matériaux de Construction Écologiques Innovants pour 2023',
      excerpt: 'Un guide complet des derniers matériaux durables qui révolutionnent l\'industrie de la construction.',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80',
      date: '22 mai 2023',
      category: 'Matériaux Écologiques'
    },
    {
      id: '3',
      title: 'Design Biophilique : Intégrer la Nature à l\'Intérieur',
      excerpt: 'Comment l\'incorporation d\'éléments naturels dans les espaces intérieurs peut améliorer le bien-être et la productivité.',
      image: 'https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80',
      date: '10 avril 2023',
      category: 'Vie Écologique'
    },
    {
      id: '4',
      title: 'Maison Passive : Principes et Avantages',
      excerpt: 'Comprendre les concepts clés derrière les maisons ultra-efficaces qui nécessitent un minimum d\'énergie pour le chauffage et le refroidissement.',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      date: '5 mars 2023',
      category: 'Design Durable'
    },
    {
      id: '5',
      title: 'Rénovation Durable : Transformer les Espaces Existants',
      excerpt: 'Conseils et stratégies pour des rénovations écologiques qui minimisent les déchets et maximisent l\'efficacité énergétique.',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      date: '18 février 2023',
      category: 'Tendances Architecture'
    },
    {
      id: '6',
      title: 'La Psychologie des Couleurs dans le Design d\'Intérieur Durable',
      excerpt: 'Comment les choix de couleurs affectent l\'humeur, la productivité et le bien-être général dans les espaces écologiques.',
      image: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      date: '30 janvier 2023',
      category: 'Vie Écologique'
    }
  ];

  // Filtrer les articles en fonction de la catégorie active
  const filteredPosts = activeCategory === 'Tous' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

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

          {/* Grille des articles */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </motion.div>

          {/* État vide */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Aucun article trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;