import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Recycle,
  Home as HomeIcon,
  Paintbrush,
  Award,
  Users,
} from "lucide-react";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import TestimonialCard from "../components/TestimonialCard";
import FeatureSection from "../components/FeatureSection";
import { useLanguage } from "../contexts/LanguageContext";

const HomePage: React.FC = () => {
  const { t, getRandomTestimonials } = useLanguage();

  // Construction de introDescription avec surlignage
  let introDescription = t("home.intro.description");
  const keywords = [
    "lieux uniques",
    "éco-responsabilité",
    "fonctionnalité",
    "esthétique",
    "eco-responsabilite", // variante sans accent pour matcher plus large
  ];
  keywords.forEach((term) => {
    // échappement correct des méta‑caractères RegExp
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${esc})`, "gi");
    introDescription = introDescription.replace(
      regex,
      '<mark class="permanent-highlight px-1 rounded">$1</mark>'
    );
  });

  const testimonials = getRandomTestimonials(3);

  // Featured projects data
  const featuredProjects = [
    {
      id: "1",
      title: "Californian Lauragaise",
      category: "Residentiel",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=4100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Toulouse, France",
    },
    {
      id: "2",
      title: "Vert Office Complexe",
      category: "Commercial",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
      location: "Toulouse, France",
    },
    {
      id: "3",
      title: "EcoGreen Loft",
      category: "Residentiel",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1153&q=80",
      location: "Fréjus, France",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title={t("home.hero.title")}
        subtitle={t("home.hero.subtitle")}
        backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=4100&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      {/* Introduction Section */}
      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              {t("home.intro.title")}
            </h2>
            <h3 className="text-4xl mb-6">{t("home.intro.subtitle")}</h3>
            <h3
              className="py-20 highlight-selection text-4xl mb-6"
              dangerouslySetInnerHTML={{ __html: introDescription }}
            />
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/projects" className="btn-primary">
                {t("home.intro.button1")}
              </Link>
              <Link to="/contact" className="btn-secondary">
                {t("home.intro.button2")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Approach Features Section */}
      <FeatureSection
        title={t("home.approach.title")}
        description={t("home.approach.description")}
        image="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        features={[
          {
            icon: <Leaf className="h-8 w-8" />,
            title: t("home.approach.feature1.title"),
            description: t("home.approach.feature1.description"),
          },
          {
            icon: <Recycle className="h-8 w-8" />,
            title: t("home.approach.feature2.title"),
            description: t("home.approach.feature2.description"),
          },
          {
            icon: <HomeIcon className="h-8 w-8" />,
            title: t("home.approach.feature3.title"),
            description: t("home.approach.feature3.description"),
          },
          {
            icon: <Paintbrush className="h-8 w-8" />,
            title: t("home.approach.feature4.title"),
            description: t("home.approach.feature4.description"),
          },
        ]}
      />

      {/* Services Section */}
      <section className="py-20 bg-[#A47B67] bg-opacity-15">
        <FeatureSection
          title={t("home.services.title")}
          description={t("home.services.description")}
          image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          imagePosition="right"
          features={[
            {
              icon: <Award className="h-8 w-8" />,
              title: t("home.services.feature1.title"),
              description: t("home.services.feature1.description"),
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: t("home.services.feature2.title"),
              description: t("home.services.feature2.description"),
            },
            {
              icon: <Recycle className="h-8 w-8" />,
              title: t("home.services.feature3.title"),
              description: t("home.services.feature3.description"),
            },
            {
              icon: <HomeIcon className="h-8 w-8" />,
              title: t("home.services.feature4.title"),
              description: t("home.services.feature4.description"),
            },
          ]}
        />
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-offwhite">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="text-center mb-12">
            <h2 className="mb-4">{t("home.projects.title")}</h2>
            <p className="max-w-2xl mx-auto text-lg">
              {t("home.projects.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/projects" className="btn-secondary">
              {t("home.projects.viewAll")}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              {t("pricing.testimonials.title")}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

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
              {t("home.cta.title")}
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t("home.cta.description")}
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
                {t("home.cta.button")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;