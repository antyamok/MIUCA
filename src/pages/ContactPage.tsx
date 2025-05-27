import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ContactForm from '../components/ContactForm';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();

  // Build FAQ items dynamically from i18n keys
  const faqs = Array.from({ length: 5 }, (_, i) => ({
    question: t(`contact.faq${i + 1}.question`),
    answer: t(`contact.faq${i + 1}.answer`),
  }));

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero ----------------------------------------------------------- */}
      {/* ---------------------------------------------------------------- */}
      <PageHeader
        title={t('contact.hero.title')}
        subtitle={t('contact.hero.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
      />

      {/* ---------------------------------------------------------------- */}
      {/* Contact Info + Form ------------------------------------------- */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ------------------ Infos ------------------ */}
            <div>
              <motion.h2
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {t('contact.getInTouch')}
              </motion.h2>

              <motion.p
                className="mb-8 text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                {t('contact.description')}
              </motion.p>

              <motion.div
                className="space-y-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Phone */}
                <div className="flex items-start">
                  <Phone className="h-6 w-6 mr-4 mt-1 text-sage flex-shrink-0" />
                  <div>
                    <h3 className="font-playfair text-xl mb-2">
                      {t('contact.callUs')}
                    </h3>
                    <p className="text-gray-600">07.87.06.92.11</p>
                  </div>
                </div>

                {/* Mail */}
                <div className="flex items-start">
                  <Mail className="h-6 w-6 mr-4 mt-1 text-sage flex-shrink-0" />
                  <div>
                    <h3 className="font-playfair text-xl mb-2">
                      {t('contact.emailUs')}
                    </h3>
                    <p className="text-gray-600">info@miuca.fr</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start">
                  <Clock className="h-6 w-6 mr-4 mt-1 text-sage flex-shrink-0" />
                  <div>
                    <h3 className="font-playfair text-xl mb-2">
                      {t('contact.officeHours')}
                    </h3>
                    <p className="text-gray-600">Lundi au vendredi, de 9h à 18h</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ------------------ Form ------------------ */}
            <div>
              <motion.h2
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {t('contact.sendMessage')}
              </motion.h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FAQ (accordion + new colors) ---------------------------------- */}
      {/* ---------------------------------------------------------------- */}
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
              {t('contact.faq.subtitle')}
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
    </div>
  );
};

export default ContactPage;
