import React from 'react';
import { motion } from 'framer-motion';

interface FeatureSectionProps {
  title: string;
  description: string;
  image: string;
  features: { icon: React.ReactNode; title: string; description: string }[];
  imagePosition?: 'left' | 'right';
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ 
  title, 
  description, 
  image, 
  features,
  imagePosition = 'left'
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-5 md:px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          {imagePosition === 'left' && (
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden"
            >
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Content Column */}
          <div>
            <motion.h2 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h2>
            <motion.p 
              className="mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {description}
            </motion.p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="text-sage mb-3">{feature.icon}</div>
                  <h3 className="font-playfair text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Image Column (Right) */}
          {imagePosition === 'right' && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden"
            >
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;