import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, this would fetch data from an API based on the ID
  // For demo purposes, we'll use mock data
  const project = {
    id: id || '1',
    title: 'Eco Harmony Villa',
    category: 'Residential',
    location: 'Paris, France',
    year: '2023',
    description: 'A modern sustainable home designed to harmonize with its natural surroundings while minimizing environmental impact. This project features passive solar design, rainwater harvesting, and locally sourced materials.',
    challenge: 'The challenge was to create a luxurious living space that maintained the highest standards of sustainability without compromising on comfort or aesthetics.',
    solution: 'We implemented a holistic approach to sustainable design, incorporating renewable energy systems, natural ventilation, and biophilic design principles. The result is a home that is both beautiful and environmentally responsible.',
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1153&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    ],
    features: [
      'Passive solar design',
      'Rainwater harvesting system',
      'Solar panel array',
      'Green roof',
      'High-efficiency insulation',
      'Locally sourced materials',
      'Smart home technology',
      'Natural ventilation system'
    ],
    prevProject: {
      id: '9',
      title: 'Historic Building Renovation'
    },
    nextProject: {
      id: '2',
      title: 'Green Office Complex'
    }
  };

  return (
    <div>
      <PageHeader 
        title={project.title}
        subtitle={`${project.category} | ${project.location}`}
        backgroundImage={project.mainImage}
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
                Project Overview
              </motion.h2>
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p>{project.description}</p>
                <h3 className="font-playfair text-xl mt-6 mb-2">The Challenge</h3>
                <p>{project.challenge}</p>
                <h3 className="font-playfair text-xl mt-6 mb-2">Our Solution</h3>
                <p>{project.solution}</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-sage bg-opacity-10 p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-playfair text-xl mb-4">Project Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-1 text-sage flex-shrink-0" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{project.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-1 text-sage flex-shrink-0" />
                  <div>
                    <p className="font-medium">Year Completed</p>
                    <p className="text-gray-600">{project.year}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-medium mb-2">Sustainable Features</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {project.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Project Gallery */}
          <div className="mb-16">
            <motion.h2 
              className="mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Project Gallery
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((image, index) => (
                <motion.div 
                  key={index}
                  className="overflow-hidden rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <img 
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`} 
                    className="w-full h-auto"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Project Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Link 
              to={`/projects/${project.prevProject.id}`} 
              className="flex items-center text-sage hover:text-terracotta transition-colors duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>
                <span className="block text-sm text-gray-500">Previous Project</span>
                {project.prevProject.title}
              </span>
            </Link>
            
            <Link 
              to={`/projects/${project.nextProject.id}`} 
              className="flex items-center text-sage hover:text-terracotta transition-colors duration-300"
            >
              <span className="text-right">
                <span className="block text-sm text-gray-500">Next Project</span>
                {project.nextProject.title}
              </span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sage bg-opacity-10">
        <div className="container mx-auto px-5 md:px-[5%] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="mb-6">Inspired by this project?</h2>
            <p className="text-lg mb-10">
              Let's discuss how we can create a sustainable, beautiful space tailored to your needs.
            </p>
            <Link to="/contact" className="btn-primary">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;