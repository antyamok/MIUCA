import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

// Define the shape of a project
interface Project {
  id: string;
  title: string;
  category: 'Résidentiel' | 'Commercial';
  image: string;
  location: string;
  project_type: string;
  main_image?: string;
}

const ProjectItem: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg group cursor-pointer"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/projects/${project.id}`}>
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ minHeight: '300px' }}
          animate={{ scale: isHovered ? 1.1 : 1 }} // Enhanced zoom effect
        />
        {/* Overlay effect with enhanced transition */}
        <motion.div
          className="absolute inset-0 bg-black transition-opacity duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.4 : 0 }}
        />
        {/* Text appears on hover with enhanced animation */}
        <motion.div
          className="absolute bottom-0 left-0 p-6 text-white w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 20,
            transition: { duration: 0.4, ease: 'easeOut' }
          }}
        >
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-sm opacity-90">{project.category} - {project.location}</p>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const ProjectsPage: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  const categories = ['Tous', 'Résidentiel', 'Commercial'];

  // Charger les projets depuis Supabase
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, project_type, location, main_image, featured')
        .eq('featured', true) // Seulement les projets mis en avant
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des projets:', error);
        return;
      }

      // Transformer les données pour correspondre à l'interface
      const transformedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        title: project.title,
        category: project.project_type === 'résidentiel' ? 'Résidentiel' : 'Commercial',
        image: project.main_image || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        location: project.location || 'France',
        project_type: project.project_type
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = activeCategory === 'Tous'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <PageHeader
        title={t('projects.hero.title')}
        subtitle={t('projects.hero.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      />

      {/* Added extra spacing with py-24 */}
      <div className="container mx-auto px-4 py-24">
        {/* Category Filter */}
        <nav className="flex space-x-6 sm:space-x-10 justify-center mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                text-base font-medium pb-2 border-b-2 transition-all duration-300
                ${activeCategory === cat
                  ? 'text-sage border-sage'
                  : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300'}
              `}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sage"></div>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-24"
            >
              {filtered.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </motion.div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-gray-500">
                  {activeCategory !== 'Tous' 
                    ? `Aucun projet ${activeCategory.toLowerCase()} n'est actuellement mis en avant.`
                    : 'Aucun projet n\'est actuellement mis en avant.'
                  }
                </p>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <section className="mt-24 bg-gray-50 rounded-xl py-16 px-8 text-center">
          <motion.h2
            className="text-3xl lg:text-4xl font-semibold mb-4 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('projects.cta.title', 'Prêt à transformer votre espace ?')}
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t(
              'projects.cta.description',
              "Discutons ensemble de vos idées. Contactez-nous pour une consultation et découvrez comment nous pouvons donner vie à votre vision."
            )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/contact"
              className="inline-block px-8 py-3 text-lg font-medium rounded-full bg-sage text-white shadow-lg shadow-sage/30 hover:bg-dark-sage transition-all duration-300 transform hover:scale-105"
            >
              {t('projects.cta.button', "Démarrer Mon Projet")}
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default ProjectsPage;