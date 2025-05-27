import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { Award, Users, Leaf, Clock } from 'lucide-react';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  /* --------------------------------------------------------------------- */
  /* --  STORY SECTION --------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const StorySection = (
    <section className="py-20">
      <div className="container mx-auto px-5 md:px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img 
              src="https://sdmntpritalynorth.oaiusercontent.com/files/00000000-0878-6246-9ce8-bd3887b7fce3/raw?se=2025-05-12T12%3A38%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=00000000-0000-0000-0000-000000000000&skoid=eb780365-537d-4279-a878-cae64e33aa9c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-11T20%3A31%3A54Z&ske=2025-05-12T20%3A31%3A54Z&sks=b&skv=2024-08-04&sig=4I3V3lOROC%2B7BSDaWo3iJsGVRZjjYEvvAUwqbTZJRcE%3D"
              alt={t('about.story.title')}
              className="rounded-lg w-full h-auto"
            />
          </motion.div>

          {/* Texte */}
          <div>
            <motion.h2 
              className="mb-6 text-3xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {t('about.story.title')}
            </motion.h2>

            <motion.div 
              className="space-y-4 text-lg leading-relaxed text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p>{t('about.story.p1')}</p>
              <p>{t('about.story.p2')}</p>
              <h3 className="text-xl font-semibold pt-6">{t('about.story.subtitle')}</h3>
              <br />
              <p>{t('about.story.p3')}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );

  /* --------------------------------------------------------------------- */
  /* --  VALUES SECTION -------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const ValuesSection = (
    <section className="py-20 bg-[#A47B67]/15">
      <div className="container mx-auto px-5 md:px-[5%]">
        <div className="text-center mb-12">
          <motion.h2 
            className="mb-4 text-3xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {t('about.values.title')}
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-lg text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('about.values.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Value 1 */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Leaf className="text-sage h-12 w-12 mb-4" />
            <h3 className="font-playfair text-xl mb-3">
              {t('about.values.value1.title')}
            </h3>
            <p className="text-gray-600">
              {t('about.values.value1.description')}
            </p>
          </motion.div>

          {/* Value 2 */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Users className="text-sage h-12 w-12 mb-4" />
            <h3 className="font-playfair text-xl mb-3">
              {t('about.values.value2.title')}
            </h3>
            <p className="text-gray-600">
              {t('about.values.value2.description')}
            </p>
          </motion.div>

          {/* Value 3 */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Award className="text-sage h-12 w-12 mb-4" />
            <h3 className="font-playfair text-xl mb-3">
              {t('about.values.value3.title')}
            </h3>
            <p className="text-gray-600">
              {t('about.values.value3.description')}
            </p>
          </motion.div>

          {/* Value 4 */}
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Clock className="text-sage h-12 w-12 mb-4" />
            <h3 className="font-playfair text-xl mb-3">
              {t('about.values.value4.title')}
            </h3>
            <p className="text-gray-600">
              {t('about.values.value4.description')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );

  /* --------------------------------------------------------------------- */
  /* --  VISION SECTION -------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const VisionSection = (
    <section className="py-20">
      <div className="container mx-auto px-5 md:px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte à gauche */}
          <div>
            <motion.h2
              className="mb-6 text-3xl font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {t('about.vision.title')}
            </motion.h2>

            <motion.div
              className="space-y-4 text-lg leading-relaxed text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p>{t('about.vision.p1')}</p>
              <p>{t('about.vision.p2')}</p>
            </motion.div>
          </div>

          {/* Image à droite */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="https://sdmntpritalynorth.oaiusercontent.com/files/00000000-0878-6246-9ce8-bd3887b7fce3/raw?se=2025-05-12T12%3A38%3A34Z&sp=r&sv=2024-08-04&sr=b&scid=00000000-0000-0000-0000-000000000000&skoid=eb780365-537d-4279-a878-cae64e33aa9c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-05-11T20%3A31%3A54Z&ske=2025-05-12T20%3A31%3A54Z&sks=b&skv=2024-08-04&sig=4I3V3lOROC%2B7BSDaWo3iJsGVRZjjYEvvAUwqbTZJRcE%3D"
              alt={t('about.vision.title')}
              className="rounded-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );

  /* --------------------------------------------------------------------- */
  /* --  RENDER ---------------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  return (
    <div>
      <PageHeader
        title={t('about.hero.title')}
        subtitle={t('about.hero.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      />

      {StorySection}
      {ValuesSection}
      {VisionSection}
      
      {/* Call To Action Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-5 md:px-[5%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-xl py-16 px-8 text-center shadow-xl"
          >
            <motion.h2 
              className="text-3xl lg:text-4xl font-semibold mb-4 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t("about.cta.title")}
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("about.cta.description")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/contact"
                className="inline-block px-8 py-3 text-lg font-medium rounded-full bg-sage text-white shadow-lg shadow-sage/30 hover:bg-dark-sage transition-all duration-300 transform hover:scale-105"
              >
                {t("about.cta.button")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;