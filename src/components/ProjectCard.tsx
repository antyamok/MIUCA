import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, category, image, location }) => {
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-lg"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/projects/${id}`}>
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <h3 className="text-white font-playfair text-xl mb-1">{title}</h3>
          <div className="flex justify-between text-offwhite text-sm">
            <span>{category}</span>
            <span>{location}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;