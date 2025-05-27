import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, excerpt, image, date, category }) => {
  return (
    <motion.article 
      className="bg-white rounded-lg overflow-hidden shadow-md"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/blog/${id}`} className="block">
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span className="text-terracotta">{category}</span>
        </div>
        <Link to={`/blog/${id}`}>
          <h3 className="font-playfair text-xl mb-3 hover:text-sage transition-colors duration-300">{title}</h3>
        </Link>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <Link to={`/blog/${id}`} className="text-sage font-medium hover:text-terracotta transition-colors duration-300">
          Lire la suite
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;