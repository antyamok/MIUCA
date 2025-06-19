import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  translationKeys?: {
    title: string;
    subtitle?: string;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  backgroundImage,
  translationKeys
}) => {
  const { t } = useLanguage();
  
  // Use translation keys if provided, otherwise use the direct text
  const displayTitle = translationKeys?.title ? t(translationKeys.title) : title;
  const displaySubtitle = translationKeys?.subtitle ? t(translationKeys.subtitle) : subtitle;

  return (
    <div 
      className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-5 md:px-[5%] text-center text-white z-10">
        <motion.h1 
          className="mb-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {displayTitle}
        </motion.h1>
        
        {displaySubtitle && (
          <motion.p 
            className="text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {displaySubtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;