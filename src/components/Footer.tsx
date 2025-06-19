import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-offwhite pt-16 pb-8">
      <div className="container mx-auto px-5 md:px-[5%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <Logo className="h-10 w-auto" />
              <span className="ml-2 font-lufga text-h3 font-medium"></span>
            </div>
            <p className="mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="hover:text-terracotta transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" className="hover:text-terracotta transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="hover:text-terracotta transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-lufga text-xl mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-terracotta transition-colors duration-300">{t('nav.home')}</Link></li>
              <li><Link to="/projects" className="hover:text-terracotta transition-colors duration-300">{t('nav.projects')}</Link></li>
              <li><Link to="/about" className="hover:text-terracotta transition-colors duration-300">{t('nav.about')}</Link></li>
              <li><Link to="/blog" className="hover:text-terracotta transition-colors duration-300">{t('nav.blog')}</Link></li>
              <li><Link to="/contact" className="hover:text-terracotta transition-colors duration-300">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-lufga text-xl mb-6">{t('footer.services')}</h3>
            <ul className="space-y-3">
              <li><Link to="/services/architecture" className="hover:text-terracotta transition-colors duration-300">{t('footer.service1')}</Link></li>
              <li><Link to="/services/interior" className="hover:text-terracotta transition-colors duration-300">{t('footer.service2')}</Link></li>
              <li><Link to="/services/renovation" className="hover:text-terracotta transition-colors duration-300">{t('footer.service3')}</Link></li>
              <li><Link to="/services/consultation" className="hover:text-terracotta transition-colors duration-300">{t('footer.service4')}</Link></li>
              <li><Link to="/services/project-management" className="hover:text-terracotta transition-colors duration-300">{t('footer.service5')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-lufga text-xl mb-6">{t('footer.contactUs')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <span>Horaire: lundi au vendredi - 9h à 18h</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>07.87.06.92.11</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>info@miuca.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
          <p>&copy; 2024-{currentYear} Miuca. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;