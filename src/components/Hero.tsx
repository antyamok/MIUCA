import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  height?: string;
  translationKeys?: {
    title: string;
    subtitle?: string;
  };
}

const Hero: React.FC<HeroProps> = ({ 
  title, 
  subtitle, 
  backgroundImage,
  height = 'h-screen',
  translationKeys
}) => {
  const { t } = useLanguage();
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // Use translation keys if provided, otherwise use the direct text
  const displayTitle = translationKeys?.title ? t(translationKeys.title) : title;
  const displaySubtitle = translationKeys?.subtitle ? t(translationKeys.subtitle) : subtitle;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = window.scrollY / window.innerHeight;
      if (scrollPercentage <= 0.1) {
        setScrollOpacity(1);
      } else if (scrollPercentage >= 0.2) {
        setScrollOpacity(0);
      } else {
        setScrollOpacity(1 - ((scrollPercentage - 0.1) * 10));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative ${height} flex items-end overflow-hidden`}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY,
          willChange: 'transform'
        }}
      />
      
      <div 
        className="container mx-auto pl-2 md:pl-4 pr-5 md:pr-[5%] text-left text-white z-10 mb-20"
        style={{ opacity: scrollOpacity, transition: 'opacity 0.3s ease-out' }}
      >
        <motion.h1 
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {displayTitle}
        </motion.h1>
        
        {displaySubtitle && (
          <motion.p 
            className="text-2xl md:text-3xl max-w-2xl font-light text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ color: '#FFFFFF' }}
          >
            "{displaySubtitle}"
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Hero;