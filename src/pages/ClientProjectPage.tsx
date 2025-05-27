import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ProjectProgress from '../components/ProjectProgress';
import ProjectGallery from '../components/ProjectGallery';

const ClientProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // In a real app, this would fetch data from an API based on the ID
  // For demo purposes, we'll use mock data
  const project = {
    id: id || '1',
    title: 'Eco Harmony Villa',
    status: 'In Progress',
    progress: 65,
    startDate: '2023-01-15',
    endDate: '2023-09-30',
    description: 'A modern sustainable home designed to harmonize with its natural surroundings while minimizing environmental impact. This project features passive solar design, rainwater harvesting, and locally sourced materials.',
    projectManager: {
      name: 'Sophie Laurent',
      email: 'sophie@ecodesign.com',
      phone: '+1 (555) 123-4567'
    },
    phases: [
      {
        name: 'Planning & Design',
        status: 'completed',
        percentage: 100
      },
      {
        name: 'Foundation & Structure',
        status: 'completed',
        percentage: 100
      },
      {
        name: 'Exterior Construction',
        status: 'in-progress',
        percentage: 70
      },
      {
        name: 'Interior Finishing',
        status: 'in-progress',
        percentage: 30
      },
      {
        name: 'Landscaping & Final Touches',
        status: 'pending',
        percentage: 0
      }
    ],
    materials: [
      {
        name: 'Reclaimed Wood',
        percentage: 35,
        isRecycled: true
      },
      {
        name: 'Eco-Friendly Concrete',
        percentage: 25,
        isRecycled: false
      },
      {
        name: 'Recycled Metal',
        percentage: 15,
        isRecycled: true
      },
      {
        name: 'Sustainable Glass',
        percentage: 15,
        isRecycled: false
      },
      {
        name: 'Other Materials',
        percentage: 10,
        isRecycled: false
      }
    ],
    gallery: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        caption: 'Front view of the villa',
        date: '2023-05-15'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1153&q=80',
        caption: 'Living room progress',
        date: '2023-05-10'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        caption: 'Kitchen installation',
        date: '2023-05-05'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        caption: 'Bedroom construction',
        date: '2023-04-28'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        caption: 'Bathroom tiling',
        date: '2023-04-20'
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        caption: 'Exterior landscaping beginning',
        date: '2023-04-15'
      }
    ],
    documents: [
      {
        id: '1',
        name: 'Floor Plans - Final Version',
        type: 'PDF',
        size: '2.4 MB',
        date: '2023-02-10'
      },
      {
        id: '2',
        name: 'Material Specifications',
        type: 'PDF',
        size: '1.8 MB',
        date: '2023-02-15'
      },
      {
        id: '3',
        name: 'Construction Timeline',
        type: 'PDF',
        size: '1.2 MB',
        date: '2023-02-20'
      },
      {
        id: '4',
        name: 'Sustainability Report',
        type: 'PDF',
        size: '3.5 MB',
        date: '2023-03-05'
      }
    ],
    updates: [
      {
        id: '1',
        date: '2023-06-10',
        content: 'Exterior cladding installation completed on the north and east facades. Work continuing on the south and west sides next week.',
        author: 'Thomas Lefèvre'
      },
      {
        id: '2',
        date: '2023-06-05',
        content: 'Kitchen cabinets have been delivered and installation has begun. Countertops scheduled for delivery next week.',
        author: 'Marc Dubois'
      },
      {
        id: '3',
        date: '2023-05-28',
        content: 'Electrical wiring completed and inspected. All systems passed inspection with no issues.',
        author: 'Thomas Lefèvre'
      }
    ]
  };

  return (
    <div className="bg-offwhite min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-5 md:px-[5%]">
        {/* Project Header */}
        <div className="mb-8">
          <Link 
            to="/client" 
            className="flex items-center text-sage hover:text-terracotta transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('clientProject.backToDashboard')}
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="mb-2">{project.title}</h1>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs mr-4 ${
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
                <span className="text-gray-600">{t('clientProject.projectId')} {project.id}</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button className="btn-secondary flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('clientProject.messageTeam')}
              </button>
              <button className="btn-primary flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {t('clientProject.scheduleMeeting')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4">{t('clientProject.overview')}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">{t('clientProject.startDate')}</p>
                  <p className="text-gray-600">{project.startDate}</p>
                </div>
                <div>
                  <p className="font-medium">{t('clientProject.estimatedCompletion')}</p>
                  <p className="text-gray-600">{project.endDate}</p>
                </div>
                <div>
                  <p className="font-medium">{t('clientProject.projectManager')}</p>
                  <p className="text-gray-600">{project.projectManager.name}</p>
                </div>
              </div>
            </motion.div>

            {/* Project Progress */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="mb-4">{t('clientProject.progress')}</h2>
              <ProjectProgress 
                progress={project.progress}
                startDate={project.startDate}
                endDate={project.endDate}
                phases={project.phases}
                materials={project.materials}
              />
            </motion.div>

            {/* Project Gallery */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="mb-4">{t('clientProject.gallery')}</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <ProjectGallery images={project.gallery} />
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Team */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-playfair text-xl mb-4">{t('clientProject.team')}</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80" 
                    alt="Sophie Laurent" 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">{project.projectManager.name}</p>
                    <p className="text-sm text-gray-600">{t('clientProject.projectManager')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                    alt="Marc Dubois" 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">Marc Dubois</p>
                    <p className="text-sm text-gray-600">Interior Designer</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Thomas Lefèvre" 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">Thomas Lefèvre</p>
                    <p className="text-sm text-gray-600">Construction Manager</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Documents */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="font-playfair text-xl mb-4">{t('clientProject.documents')}</h3>
              <div className="space-y-3">
                {project.documents.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.size} • {doc.date}</p>
                    </div>
                    <button className="text-sage hover:text-terracotta transition-colors duration-300">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Updates */}
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-playfair text-xl mb-4">{t('clientProject.updates')}</h3>
              <div className="space-y-4">
                {project.updates.map((update) => (
                  <div key={update.id} className="border-l-2 border-sage pl-4 pb-4">
                    <p className="text-sm text-gray-500 mb-1">{update.date}</p>
                    <p className="mb-1">{update.content}</p>
                    <p className="text-sm text-gray-600">- {update.author}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProjectPage;