// src/pages/PricingPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Leaf, Shield, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import TestimonialCard from '../components/TestimonialCard';
import { useLanguage } from '../contexts/LanguageContext';
import { IconLibrary } from '../lib/LibraryIcons';

const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

const PricingPage: React.FC = () => {
  const { t, getRandomTestimonials } = useLanguage();
  const [revealedPrices, setRevealedPrices] = useState<{ [key: string]: boolean }>({});

  // Intro avec mots-clés surlignés
  let introDescription = t('pricing.introduction.subtitle');
  ['juste', 'engagement', 'transparente', 'durables'].forEach(term => {
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${esc})`, 'gi');
    introDescription = introDescription.replace(
      regex,
      '<mark class="permanent-highlight px-1 rounded">$1</mark>'
    );
  });

  // ── Forfaits Particuliers ────────────────────────────────────────────
  const packages = [
    {
      iconKey: 'package50',
      name: t('pricing.package.50.title'),
      subtitle: t('pricing.package.50.subtitle'),
      description: t('pricing.package.50.description'),
      included: [
        t('pricing.package.50.feature1'),
        t('pricing.package.50.feature2'),
        t('pricing.package.50.feature3'),
        t('pricing.package.50.feature4'),
        t('pricing.package.50.feature5'),
      ],
      price: '180€ TTC',
      priceDetails: "*Les Plans de l'existant avec cotations seront fournis par vos soins'",
    },
    {
      iconKey: 'package100',
      name: t('pricing.package.100.title'),
      subtitle: t('pricing.package.100.subtitle'),
      description: t('pricing.package.100.description'),
      included: [
        t('pricing.package.100.feature1'),
        t('pricing.package.100.feature2'),
        t('pricing.package.100.feature3'),
        t('pricing.package.100.feature4'),
        t('pricing.package.100.feature5'),
        t('pricing.package.100.feature6'),
      ],
      price: '25 à 45€',
      priceDetails: 'TTC/m² - Selon complexité du projet - Minimum 500€TTC',
    },
    {
      iconKey: 'package150',
      name: t('pricing.package.150.title'),
      subtitle: t('pricing.package.150.subtitle'),
      description: t('pricing.package.150.description'),
      included: [
        t('pricing.package.150.feature1'),
        t('pricing.package.150.feature2'),
        t('pricing.package.150.feature3'),
        t('pricing.package.150.feature4'),
      ],
      price: '35 à 60€',
      priceDetails:
        "TTC/m² – Selon complexité du projet\nMinimum 600€TTC\n* Prise de cotes obligatoire",
    },
  ];

  // ── Forfaits Professionnels ─────────────────────────────────────────
  const professionalPackages = [
    {
      iconKey: 'proEmpreinte',
      name: 'Forfait Empreinte',
      subtitle: 'Solution pour une ambiance pro cohérente et différenciante',
      description: "Pour valoriser rapidement un espace d'entrée ou de réception",
      included: [
        'Audit des besoins et contraintes métier',
        "Recommandations d'aménagement",
        'Sélection mobilier, déco, couleurs, éclairages',
        "Mise en cohérence avec l'image de marque",
        'Liste shopping',
      ],
      price: 'à partir de 350 €',
      priceDetails:
        'HT - Tarification adaptée selon la surface et la complexité du projet',
    },
    {
      iconKey: 'proCommerce',
      name: 'Forfait Canopée',
      subtitle: 'Valorisez votre espace commercial',
      description:
        "Création d'espaces commerciaux attractifs qui optimisent l'expérience client et valorisent votre marque.",
      included: [
        'Étude de flux et parcours client',
        "Design d'identité spatiale",
        'Projet sur-mesure (Plans techniques, Zoning, 3D)',
        'Mobilier, cloisons, agencement fonctionnel',
        'Coordination avec prestataire et suivi design',
      ],
      price: 'Sur devis',
      priceDetails:
        'HT\n1800€ minimum\nÉtude personnalisée selon vos objectifs commerciaux',
    },
  ];

  // ── FAQ & Témoignages ───────────────────────────────────────────────
  const faqs = Array.from({ length: 5 }, (_, i) => ({
    question: t(`pricing.faq${i + 1}.question`),
    answer: t(`pricing.faq${i + 1}.answer`),
  }));
  const testimonials = getRandomTestimonials(3);

  // Toggle affichage du tarif détaillé
  const togglePriceReveal = (key: string) => {
    setRevealedPrices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Composant d’intro animée
  const PricingIntroduction = (
    <section className="py-20">
      <div className="container mx-auto px-5 md:px-[5%] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h3
            className="text-4xl mb-6 highlight-selection"
            dangerouslySetInnerHTML={{ __html: introDescription }}
          />
        </motion.div>
      </div>
    </section>
  );

  // Rendu d’une carte de forfait
  const renderPackageCard = (pkg: any, index: number, isProfessional = false) => {
    const key = isProfessional ? `prof_${index}` : `${index}`;
    const Icon = IconLibrary[pkg.iconKey] || IconLibrary.package50;

    return (
      <motion.div
        key={key}
        className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <div className="p-8">
          {/* Icône */}
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-sage bg-opacity-10 rounded-full">
              <Icon className="h-8 w-8 text-sage" />
            </div>
          </div>

          {/* Titres */}
          <h3 className="text-2xl font-playfair text-center mb-2 text-gray-900">
            {pkg.name}
          </h3>
          <p className="text-gray-600 font-playfair text-center mb-6 text-lg">
            {pkg.subtitle}
          </p>

          {/* Description */}
          <div className="text-center mb-5">
            <div className="inline-block bg-sage bg-opacity-10 p-4 rounded-[10px]">
              <p className="text-sage text-sm font-medium">
                {pkg.description}
              </p>
            </div>
          </div>

          {/* Liste des inclus */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-3 text-center">
              Inclus
            </h4>
            <ul className="space-y-3">
              {pkg.included.map((feature: string, i: number) => (
                <li key={i} className="flex items-start text-sm">
                  <Check className="h-4 w-4 text-sage flex-shrink-0 mr-3 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bouton Tarifs */}
          <div className="space-y-4">
            <button
              onClick={() => togglePriceReveal(key)}
              className="w-full py-3 px-6 rounded-lg transition-all duration-300 border-2 border-sage text-sage hover:bg-sage hover:text-white flex items-center justify-center font-medium"
            >
              <span>Tarifs</span>
              {revealedPrices[key] ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </button>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: revealedPrices[key] ? 1 : 0,
                height: revealedPrices[key] ? 'auto' : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {revealedPrices[key] && (
                <div className="bg-sage bg-opacity-5 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-sage mb-1">
                    {pkg.price}
                  </div>
                  <p className="text-gray-600 text-sm font-medium whitespace-pre-line">
                    {pkg.priceDetails}
                  </p>
                  <button className="mt-4 w-full py-2 px-4 bg-sage text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300">
                    {t('pricing.package.button')}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      <PageHeader
        title={t('pricing.hero.title')}
        subtitle={t('pricing.hero.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
      />

      {/* Intro */}
      {PricingIntroduction}

      {/* Gamme Particuliers */}
      <section className="text-center mt-12 mb-6">
        <h2 className="text-4xl font-playfair text-sage mb-4">
          Gamme Particuliers
        </h2>
        <div className="w-24 h-1 bg-sage mx-auto rounded-full" />
      </section>

      {/* Cartes Particuliers */}
      <section className="py-12">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => renderPackageCard(pkg, i, false))}
          </div>
        </div>
      </section>

      {/* Gamme Professionnel */}
      <section className="text-center mt-16 mb-8">
        <h2 className="text-4xl font-playfair text-sage mb-4">
          Gamme Professionnel
        </h2>
        <div className="w-24 h-1 bg-sage mx-auto rounded-full" />
      </section>

      {/* Cartes Professionnel */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {professionalPackages.map((pkg, i) => renderPackageCard(pkg, i, true))}
          </div>
        </div>
      </section>

      {/* Concept / Valeurs */}
      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <Leaf className="h-12 w-12 text-sage" />
              </div>
              <h3 className="text-xl font-playfair mb-2">{t('pricing.concept1.title')}</h3>
              <p className="text-gray-600">{t('pricing.concept1.description')}</p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-sage" />
              </div>
              <h3 className="text-xl font-playfair mb-2">{t('pricing.concept2.title')}</h3>
              <p className="text-gray-600">{t('pricing.concept2.description')}</p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-sage" />
              </div>
              <h3 className="text-xl font-playfair mb-2">{t('pricing.concept3.title')}</h3>
              <p className="text-gray-600">{t('pricing.concept3.description')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#A47B67] bg-opacity-15">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-playfair mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {t('pricing.faq.subtitle')}
            </motion.h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, idx) => (
              <motion.details
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <summary className="text-xl font-playfair text-sage cursor-pointer mb-2">
                  {faq.question}
                </summary>
                <p className="text-gray-600 pt-2">{faq.answer}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-playfair mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {t('pricing.testimonials.title')}
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((ts, idx) => (
              <TestimonialCard key={idx} {...ts} />
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 relative">
        <div className="container mx-auto px-5 md:px-[5%]">
          <motion.div
            className="bg-gray-50 rounded-xl py-16 px-8 text-center shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl lg:text-4xl font-semibold mb-4 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {t('pricing.cta.title')}
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {t('pricing.cta.description')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                to="/contact"
                className="inline-block px-8 py-3 text-lg font-medium rounded-full bg-sage text-white shadow-lg shadow-sage/30 hover:bg-dark-sage transition-all duration-300 transform hover:scale-105"
              >
                {t('pricing.cta.button')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
