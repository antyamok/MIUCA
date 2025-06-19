import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  description?: string;
  challenge?: string;
  solution?: string;
  location?: string;
  project_type?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  featured?: boolean;
  main_image?: string;
  year_completed?: string;
  created_at: string;
  features?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  gallery?: Array<{
    id: string;
    image_url: string;
    caption?: string;
    display_order: number;
  }>;
}

const ProjectDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [prevProject, setPrevProject] = useState<{ id: string; title: string } | null>(null);
  const [nextProject, setNextProject] = useState<{ id: string; title: string } | null>(null);

  // Charger les données du projet depuis Supabase
  const loadProject = async () => {
    if (!id) return;

    setIsLoading(true);
    setError('');

    try {
      // Charger le projet principal (sans les informations client)
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) {
        throw projectError;
      }

      if (!projectData) {
        setError('Projet non trouvé');
        return;
      }

      // Charger les caractéristiques clés du projet
      const { data: featuresData } = await supabase
        .from('project_features')
        .select(`
          feature_id,
          sustainable_features(id, name, description)
        `)
        .eq('project_id', id);

      // Charger la galerie du projet
      const { data: galleryData } = await supabase
        .from('project_gallery')
        .select('*')
        .eq('project_id', id)
        .order('display_order');

      // Construire l'objet projet complet
      const fullProject: Project = {
        ...projectData,
        features: featuresData?.map(f => f.sustainable_features).filter(Boolean) || [],
        gallery: galleryData || []
      };

      setProject(fullProject);

      // Charger les projets précédent et suivant
      await loadNavigationProjects(projectData.created_at);

    } catch (error: any) {
      console.error('Erreur lors du chargement du projet:', error);
      setError('Impossible de charger le projet');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les projets de navigation (précédent/suivant)
  const loadNavigationProjects = async (currentProjectDate: string) => {
    try {
      // Projet précédent (plus ancien)
      const { data: prevData } = await supabase
        .from('projects')
        .select('id, title')
        .eq('featured', true)
        .lt('created_at', currentProjectDate)
        .order('created_at', { ascending: false })
        .limit(1);

      if (prevData && prevData.length > 0) {
        setPrevProject(prevData[0]);
      }

      // Projet suivant (plus récent)
      const { data: nextData } = await supabase
        .from('projects')
        .select('id, title')
        .eq('featured', true)
        .gt('created_at', currentProjectDate)
        .order('created_at', { ascending: true })
        .limit(1);

      if (nextData && nextData.length > 0) {
        setNextProject(nextData[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des projets de navigation:', error);
    }
  };

  // Fonction pour formater le texte avec des retours à la ligne
  const formatTextWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sage"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Projet non trouvé'}
        </h1>
        <Link to="/projects" className="btn-primary">
          Retour aux projets
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div>
      <PageHeader 
        title={project.title}
        subtitle={`${project.project_type === 'résidentiel' ? 'Résidentiel' : 'Commercial'} | ${project.location || 'France'}`}
        backgroundImage={project.main_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'}
      />

      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          {/* Project Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <motion.h2 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t("project.overview")}
              </motion.h2>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {project.description && <p>{formatTextWithLineBreaks(project.description)}</p>}
                
                {project.challenge && (
                  <>
                    <h3 className="font-playfair text-xl mt-6 mb-2">{t("project.challenge")}</h3>
                    <p>{formatTextWithLineBreaks(project.challenge)}</p>
                  </>
                )}
                
                {project.solution && (
                  <>
                    <h3 className="font-playfair text-xl mt-6 mb-2">{t("project.solution")}</h3>
                    <p>{formatTextWithLineBreaks(project.solution)}</p>
                  </>
                )}
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-sage bg-opacity-10 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-playfair text-xl mb-4">{t("project.details")}</h3>
              <div className="space-y-4">
                {project.location && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-1 text-sage flex-shrink-0" />
                    <div>
                      <p className="font-medium">{t("project.location")}</p>
                      <p className="text-gray-600">{project.location}</p>
                    </div>
                  </div>
                )}
                
                {project.year_completed && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 mt-1 text-sage flex-shrink-0" />
                    <div>
                      <p className="font-medium">{t("project.yearCompleted")}</p>
                      <p className="text-gray-600">{project.year_completed}</p>
                    </div>
                  </div>
                )}

                {project.start_date && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 mt-1 text-sage flex-shrink-0" />
                    <div>
                      <p className="font-medium">Date de début</p>
                      <p className="text-gray-600">{formatDate(project.start_date)}</p>
                    </div>
                  </div>
                )}

                {project.end_date && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 mt-1 text-sage flex-shrink-0" />
                    <div>
                      <p className="font-medium">Date de fin prévue</p>
                      <p className="text-gray-600">{formatDate(project.end_date)}</p>
                    </div>
                  </div>
                )}

                {project.features && project.features.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="font-medium mb-2">Caractéristiques clés</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {project.features.map((feature) => (
                        <li key={feature.id} title={feature.description}>
                          {feature.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="font-medium mb-2">Statut</p>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'completed' ? 'Terminé' :
                     project.status === 'in_progress' ? 'En cours' :
                     project.status === 'on_hold' ? 'En pause' :
                     project.status === 'cancelled' ? 'Annulé' :
                     'Brouillon'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Project Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mb-16">
              <motion.h2 
                className="mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t("project.gallery")}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery.map((image, index) => (
                  <motion.div 
                    key={image.id}
                    className="overflow-hidden rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <img 
                      src={image.image_url} 
                      alt={image.caption || `${project.title} - Image ${index + 1}`} 
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {image.caption && (
                      <div className="p-3 bg-gray-50">
                        <p className="text-sm text-gray-600">{image.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Project Navigation */}
          {(prevProject || nextProject) && (
            <div className="flex justify-between items-center pt-8 border-t border-gray-200 mb-20">
              {prevProject ? (
                <Link 
                  to={`/projects/${prevProject.id}`} 
                  className="flex items-center text-sage hover:text-terracotta transition-colors duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span>
                    <span className="block text-sm text-gray-500">{t("project.previousProject")}</span>
                    {prevProject.title}
                  </span>
                </Link>
              ) : (
                <div></div>
              )}
              
              {nextProject ? (
                <Link 
                  to={`/projects/${nextProject.id}`} 
                  className="flex items-center text-sage hover:text-terracotta transition-colors duration-300"
                >
                  <span className="text-right">
                    <span className="block text-sm text-gray-500">{t("project.nextProject")}</span>
                    {nextProject.title}
                  </span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          )}

          {/* Call to Action */}
          <section className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl py-16 px-8 text-center shadow-xl"
            >
              <motion.h2 
                className="text-3xl lg:text-4xl font-semibold mb-4 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t("project.cta.title")}
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t("project.cta.description")}
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
                  {t("project.cta.button")}
                </Link>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;