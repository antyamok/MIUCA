import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import PageHeader from '../components/PageHeader';
import LoginForm from '../components/LoginForm';

const ClientAreaPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Rediriger selon le rôle de l'utilisateur
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'client') {
        navigate('/client');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Si l'utilisateur est déjà connecté, ne pas afficher la page de connexion
  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title={t('clientArea.hero.title')}
        subtitle={t('clientArea.hero.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1153&q=80"
      />

      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6">{t('clientArea.welcome')}</h2>
              <div className="space-y-4 mb-8">
                <p>
                  {t('clientArea.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('clientArea.feature1')}</li>
                  <li>{t('clientArea.feature2')}</li>
                  <li>{t('clientArea.feature3')}</li>
                  <li>{t('clientArea.feature4')}</li>
                  <li>{t('clientArea.feature5')}</li>
                  <li>{t('clientArea.feature6')}</li>
                </ul>
                <p className="mt-6">
                  {t('clientArea.noCredentials')} <a 
                    href="mailto:clients@miuca.fr" 
                    className="text-sage hover:text-terracotta transition-colors duration-300 underline"
                  >
                    clients@miuca.fr
                  </a>.
                </p>
              </div>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <LoginForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-sage bg-opacity-10">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="text-center mb-12">
            <motion.h2 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {t('clientArea.features.title')}
            </motion.h2>
            <motion.p 
              className="max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {t('clientArea.features.subtitle')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-playfair text-xl mb-3">{t('clientArea.features.feature1.title')}</h3>
              <p className="text-gray-600">
                {t('clientArea.features.feature1.description')}
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-playfair text-xl mb-3">{t('clientArea.features.feature2.title')}</h3>
              <p className="text-gray-600">
                {t('clientArea.features.feature2.description')}
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-playfair text-xl mb-3">{t('clientArea.features.feature3.title')}</h3>
              <p className="text-gray-600">
                {t('clientArea.features.feature3.description')}
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-playfair text-xl mb-3">{t('clientArea.features.feature4.title')}</h3>
              <p className="text-gray-600">
                {t('clientArea.features.feature4.description')}
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="font-playfair text-xl mb-3">{t('clientArea.features.feature5.title')}</h3>
              <p className="text-gray-600">
                {t('clientArea.features.feature5.description')}
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-playfair text-xl mb-3">{t('clientArea.features.feature6.title')}</h3>
              <p className="text-gray-600">
                {t('clientArea.features.feature6.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientAreaPage;