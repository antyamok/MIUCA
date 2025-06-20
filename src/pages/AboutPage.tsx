import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { Award, Users, Leaf, Clock, CheckCircle } from 'lucide-react';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  /* --------------------------------------------------------------------- */
  /* --  STORY SECTION --------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const StorySection: React.FC = () => (
    <section className="py-20">
      <div className="container mx-auto px-5 md:px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-start"
          >
            <div className="w-80 h-80 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={t('about.story.title')}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Texte */}
          <div className="flex flex-col justify-center">
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
  const ValuesSection: React.FC = () => (
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
  const VisionSection: React.FC = () => (
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
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt={t('about.vision.title')}
              className="rounded-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );

  /* --------------------------------------------------------------------- */
  /* --  10 REASONS SECTION --------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const ReasonsSection: React.FC = () => {
    const reasons = [
      "Faire appel à un architecte d'intérieur garantit une optimisation sur-mesure de chaque mètre carré, grâce à une étude technique et spatiale approfondie",
      "Il anticipe et élimine les erreurs coûteuses en élaborant des plans précis, ce qui réduit les imprévus financiers et les retards de chantier",
      "En mobilisant son réseau de fournisseurs et d'artisans qualifiés, il négocie les meilleurs tarifs et assure la qualité durable des matériaux",
      "Son expertise esthétique crée une harmonie cohérente entre style, couleurs et volumes, valorisant immédiatement et durablement votre espace",
      "Il conçoit des ambiances personnalisées qui répondent à vos besoins réels, améliorant votre confort et la fonctionnalité du quotidien",
      "En pilotant votre projet de A à Z, il vous fait gagner un temps précieux et vous libère du stress lié à la coordination des corps de métier",
      "Il veille à la conformité réglementaire et technique de vos espaces, garantissant sécurité et tranquillité d'esprit",
      "Son regard créatif et innovant apporte une valeur ajoutée unique, rendant votre intérieur à la fois fonctionnel et inspirant",
      "Investir dans ses services, c'est maximiser la valorisation de votre patrimoine et optimiser votre retour sur investissement en cas de revente",
      "Avec passion et détermination, l'architecte d'intérieur transforme votre vision en réalité et fait de chaque projet une réussite exemplaire"
    ];

    return (
      <section className="py-20 bg-gradient-to-br from-sage/5 to-accent/10">
        <div className="container mx-auto px-5 md:px-[5%]">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Titre principal */}
            <div className="text-center mb-12">
              <motion.h2
                className="text-3xl lg:text-4xl font-playfair mb-6 text-sage"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Valeur, qualité, sérénité : 10 bonnes raisons d'engager un architecte d'intérieur
              </motion.h2>
            </div>

            {/* Liste des raisons */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="space-y-6">
                {reasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Numéro avec icône */}
                    <div className="flex-shrink-0 w-12 h-12 bg-sage rounded-full flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    
                    {/* Texte de la raison */}
                    <div className="flex-1 pt-2">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {reason}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

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

      <StorySection />
      <ValuesSection />
      <VisionSection />
      <ReasonsSection />
      
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