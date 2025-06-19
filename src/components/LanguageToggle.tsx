import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`relative group ${className}`}>
      <button className="flex items-center text-current">
        <Globe className="h-5 w-5 mr-1" />
        <span className="hidden md:inline font-poppins">{t('language')}</span>
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden transform scale-0 group-hover:scale-100 transition-transform origin-top duration-200 z-50">
        <button 
          className={`block w-full text-left px-4 py-2 text-dark hover:bg-sage hover:text-white ${language === 'en' ? 'bg-sage bg-opacity-10' : ''}`}
          onClick={() => setLanguage('en')}
        >
          {t('language.english')}
        </button>
        <button 
          className={`block w-full text-left px-4 py-2 text-dark hover:bg-sage hover:text-white ${language === 'fr' ? 'bg-sage bg-opacity-10' : ''}`}
          onClick={() => setLanguage('fr')}
        >
          {t('language.french')}
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;