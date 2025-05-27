import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

// Define the shape of a project
interface Project {
  id: string;
  code: string;
  title: string;
  category: 'Résidentiel' | 'Commercial';
  image: string;
  location: string;
  area: string;
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
  const categories = ['Residential', 'Commercial'];
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  const projects: Project[] = [
    {
      id: '1',
      code: 'CM 107',
      title: 'Villa Sérénité Blanche',
      category: 'Residential',
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
      location: 'Aix-en-Provence, France',
      area: '180 m²'
    },
    {
      id: '2',
      code: 'GL 121',
      title: 'Espace Co-working "Focus"',
      category: 'Commercial',
      image: 'https://images.unsplash.com/photo-1585865173329-2d15a94195b1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      location: 'Lyon, France',
      area: '450 m²'
    },
  ];

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
              {t(`projects.category.${cat.toLowerCase()}`, cat)}
            </button>
          ))}
        </nav>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-24"
        >
          {filtered.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </motion.div>

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