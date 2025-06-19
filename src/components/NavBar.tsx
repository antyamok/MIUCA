import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Globe } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  const isHomePage = location.pathname === '/';
  const isPricingPage = location.pathname === '/pricing';
  const isAboutPage = location.pathname === '/about';
  const isContactPage = location.pathname === '/contact';
  const isClientAreaPage = location.pathname === '/client-area';
  const isBlogPage = location.pathname === '/blog' || location.pathname.startsWith('/blog/');
  const isProjectsPage = location.pathname === '/projects' || location.pathname.startsWith('/projects/');
  const isDashboard = location.pathname.startsWith('/client') || location.pathname.startsWith('/admin');

  // Pages with hero sections that should have transparent navbar initially
  const isHeroPage = isHomePage || isPricingPage || isAboutPage || isContactPage || isClientAreaPage || isBlogPage || isProjectsPage;

  /* -------------------------------------------------- */
  /*   Helpers                                          */
  /* -------------------------------------------------- */
  const isActive = (path: string) => location.pathname === path;

  const navbarBgClass = () => {
    if (isDashboard) {
      // Dashboard pages always have solid background
      return 'bg-white/90 backdrop-blur-lg shadow-md py-2';
    }
    return isScrolled ? 'bg-white/70 backdrop-blur-lg shadow-md py-2' : 'bg-transparent py-4';
  };

  const textColorClass = () => {
    if (isDashboard) {
      // Dashboard pages always use dark text
      return 'text-[#2A11D8]';
    }
    
    // Si on a scrollé, toujours utiliser la couleur sombre
    if (isScrolled) return 'text-[#2A11D8]';
    
    // Si on est sur une page avec hero, utiliser le texte clair
    if (isHeroPage) {
      return 'text-[#F7F4F2]';
    }
    
    // Pour les autres pages, utiliser la couleur sombre
    return 'text-[#2A11D8]';
  };

  const logoVariant = () => {
    if (isDashboard) {
      // Dashboard pages always use dark variant
      return 'light';
    }
    
    // Si on a scrollé, toujours utiliser la version sombre
    if (isScrolled) return 'light';
    
    // Si on est sur une page avec hero, utiliser la version claire
    if (isHeroPage) {
      return 'dark';
    }
    
    // Pour les autres pages, utiliser la version sombre
    return 'light';
  };

  const logoSizeClass = () => {
    if (isDashboard) {
      // Dashboard pages always use small logo
      return 'h-10 w-auto';
    }
    return isHeroPage && !isScrolled ? 'h-20 w-auto' : 'h-10 w-auto';
  };

  /* -------------------------------------------------- */
  /*   Scroll listener                                  */
  /* -------------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* -------------------------------------------------- */
  /*   Render                                           */
  /* -------------------------------------------------- */
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${navbarBgClass()}`}>
      <div className="container mx-auto pl-2 md:pl-4 pr-5 md:pr-[5%]">
        <div className="flex justify-between items-center">
          {/* Logo ------------------------------------------------- */}
          <Link to="/" className="flex items-center">
            <Logo
              className={`transition-all duration-300 ${logoSizeClass()}`}
              variant={logoVariant()}
            />
          </Link>

          {/* Desktop navigation ---------------------------------- */}
          <nav className={`hidden md:flex items-center space-x-nav-spacing ${textColorClass()}`}>
            <Link to="/"       className={`nav-link ${isActive('/')        ? 'nav-link-active' : ''}`}>{t('nav.home')}</Link>
            <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'nav-link-active' : ''}`}>{t('nav.projects')}</Link>
            <Link to="/blog" className={`nav-link ${isActive('/blog') ? 'nav-link-active' : ''}`}>{t('nav.blog')}</Link>
            <Link to="/about"   className={`nav-link ${isActive('/about')   ? 'nav-link-active' : ''}`}>{t('nav.about')}</Link>
            <Link to="/pricing" className={`nav-link ${isActive('/pricing') ? 'nav-link-active' : ''}`}>{t('nav.pricing')}</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'nav-link-active' : ''}`}>{t('nav.contact')}</Link>

            {/* Client area */}
            <Link
              to="/client-area"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-sage text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Language toggle */}
            <div className="relative group">
              <button className={`flex items-center ${textColorClass()}`}>
                <Globe className="h-5 w-5" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden transform scale-0 group-hover:scale-100 transition-transform origin-top duration-200 z-50">
                <button
                  className={`block w-full text-left px-4 py-2 text-[#2A11D8] hover:bg-sage hover:text-white ${language === 'en' ? 'bg-sage bg-opacity-10' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  {t('language.english')}
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-[#2A11D8] hover:bg-sage hover:text-white ${language === 'fr' ? 'bg-sage bg-opacity-10' : ''}`}
                  onClick={() => setLanguage('fr')}
                >
                  {t('language.french')}
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile buttons -------------------------------------- */}
          <div className="flex items-center md:hidden">
            {/* Language */}
            <div className="relative group mr-4">
              <button className={textColorClass()}>
                <Globe className="h-5 w-5" />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden transform scale-0 group-hover:scale-100 transition-transform origin-top duration-200 z-50">
                <button
                  className={`block w-full text-left px-4 py-2 text-[#2A11D8] hover:bg-sage hover:text-white ${language === 'en' ? 'bg-sage bg-opacity-10' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  {t('language.english')}
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-[#2A11D8] hover:bg-sage hover:text-white ${language === 'fr' ? 'bg-sage bg-opacity-10' : ''}`}
                  onClick={() => setLanguage('fr')}
                >
                  {t('language.french')}
                </button>
              </div>
            </div>

            {/* Burger */}
            <button className={textColorClass()} onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation ------------------------------------- */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen bg-white' : 'max-h-0'}`}>
        <div className="container mx-auto px-5 py-4 flex flex-col space-y-4">
          <Link to="/"        className="nav-link text-xl text-[#2A11D8]" onClick={() => setIsOpen(false)}>{t('nav.home')}</Link>
          <Link to="/projects" className="nav-link text-xl text-[#2A11D8]" onClick={() => setIsOpen(false)}>{t('nav.projects')}</Link>
          <Link to="/about"   className="nav-link text-xl text-[#2A11D8]" onClick={() => setIsOpen(false)}>{t('nav.about')}</Link>
          <Link to="/pricing" className="nav-link text-xl text-[#2A11D8]" onClick={() => setIsOpen(false)}>{t('nav.pricing')}</Link>
          <Link to="/blog"    className="nav-link text-xl text-[#2A11D8]" onClick={() => setIsOpen(false)}>{t('nav.blog')}</Link>
          <Link to="/contact" className="nav-link text-xl text-[#2A11D8]" onClick={() => setIsOpen(false)}>{t('nav.contact')}</Link>

          {/* Client area */}
          <Link
            to="/client-area"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-sage text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;