import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Leaf, Shield, Clock, HelpCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import TestimonialCard from '../components/TestimonialCard';
import { useLanguage } from '../contexts/LanguageContext';

const PricingPage: React.FC = () => {
  const { t, getRandomTestimonials } = useLanguage();
// Construction de introDescription avec surlignage
let introDescription = t('pricing.introduction.subtitle');
const keywords = [
  'juste',
  'engagement',
  'transparente',
  'durables'
];
keywords.forEach(term => {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${esc})`, 'gi');
  introDescription = introDescription.replace(
    regex,
    '<mark class="permanent-highlight px-1 rounded">$1</mark>'
  );
});
  
  const packages = [
    {
      name: t('pricing.package.50.title'),
      subtitle: t('pricing.package.50.subtitle'),
      description: t('pricing.package.50.description'),
      features: [
        t('pricing.package.50.feature1'),
        t('pricing.package.50.feature2'),
        t('pricing.package.50.feature3'),
        t('pricing.package.50.feature4'),
        t('pricing.package.50.feature5'),
      ],
    },
    {
      name: t('pricing.package.100.title'),
      subtitle: t('pricing.package.100.subtitle'),
      description: t('pricing.package.100.description'),
      features: [
        t('pricing.package.100.feature1'),
        t('pricing.package.100.feature2'),
        t('pricing.package.100.feature3'),
        t('pricing.package.100.feature4'),
        t('pricing.package.100.feature5'),
      ],
    },
    {
      name: t('pricing.package.150.title'),
      subtitle: t('pricing.package.150.subtitle'),
      description: t('pricing.package.150.description'),
      features: [
        t('pricing.package.150.feature1'),
        t('pricing.package.150.feature2'),
        t('pricing.package.150.feature3'),
        t('pricing.package.150.feature4'),
        t('pricing.package.150.feature5'),
      ],
    },
  ];

  const faqs = Array.from({ length: 5 }, (_, i) => ({
    question: t(`pricing.faq${i + 1}.question`),
    answer: t(`pricing.faq${i + 1}.answer`)
  }));

  const testimonials = getRandomTestimonials(3);

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

  return (
    <div>
      <PageHeader
        title={t('pricing.hero.title')}
        subtitle={t('pricing.hero.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      />

      {PricingIntroduction}

      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <Leaf className="h-8 w-8 text-sage" />
                  </div>
                  <h3 className="text-2xl font-playfair text-center mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 font-playfair text-center mb-6">{pkg.subtitle}</p>
                  <p className="text-2x1 text-center mb-6">{pkg.description}</p>
                  <ul className="space-y-4 mb-8 text-left">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-sage flex-shrink-0 mr-3 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 px-6 rounded-lg transition-colors duration-300 border border-sage text-sage hover:bg-sage hover:text-white">
                    {t('pricing.package.button')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <div className="flex justify-center mb-4"><Leaf className="h-12 w-12 text-sage" /></div>
              <h3 className="text-xl font-playfair mb-2">{t('pricing.concept1.title')}</h3>
              <p className="text-gray-600">{t('pricing.concept1.description')}</p>
            </motion.div>

            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
              <div className="flex justify-center mb-4"><Shield className="h-12 w-12 text-sage" /></div>
              <h3 className="text-xl font-playfair mb-2">{t('pricing.concept2.title')}</h3>
              <p className="text-gray-600">{t('pricing.concept2.description')}</p>
            </motion.div>

            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
              <div className="flex justify-center mb-4"><Clock className="h-12 w-12 text-sage" /></div>
              <h3 className="text-xl font-playfair mb-2">{t('pricing.concept3.title')}</h3>
              <p className="text-gray-600">{t('pricing.concept3.description')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#A47B67] bg-opacity-15">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="text-center mb-12">
            <motion.h2 className="text-3xl font-playfair mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              {t('pricing.faq.subtitle')}
            </motion.h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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

      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="text-center mb-12">
            <motion.h2 className="text-3xl font-playfair mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              {t('pricing.testimonials.title')}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
      
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
              {t("pricing.cta.title")}
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("pricing.cta.description")}
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
                {t("pricing.cta.button")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;