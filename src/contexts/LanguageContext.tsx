import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Langue disponible
export type Language = 'fr' | 'en';

// Type du context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getRandomTestimonials: (count: number) => Testimonial[];
}

interface LanguageProviderProps {
  children: ReactNode;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'Agence',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.clientArea': 'Client Area',
    'nav.residential': 'Residential',
    'nav.commercial': 'Commercial',
    'nav.allProjects': 'All Projects',

    // Home Page
    'home.hero.title': 'Sustainable Architecture & Interior Design',
    'home.hero.subtitle': 'Creating beautiful spaces in harmony with nature',
    'home.intro.title': 'Designing Sustainable Futures',
    'home.intro.subtitle': 'We design bespoke interiors that reflect your personality and meet your needs.',
    'home.intro.description': 'Miuca, your interior design partner in Toulouse, transforms your spaces into unique places combining aesthetics, eco-responsibility and functionality.',
    'home.intro.button1': 'Explore Our Projects',
    'home.intro.button2': 'Get in Touch',
    'home.projects.title': 'Featured Projects',
    'home.projects.description': 'Discover our most innovative and sustainable designs that showcase our commitment to eco-friendly architecture.',
    'home.projects.viewAll': 'View All Projects',
    'home.approach.title': 'Sustainable Design Approach',
    'home.approach.description': 'Our eco-conscious methodology integrates innovative solutions that minimize environmental impact while maximizing comfort and aesthetics.',
    'home.approach.feature1.title': 'Eco-Friendly Materials',
    'home.approach.feature1.description': 'We prioritize sustainable, locally-sourced materials that reduce carbon footprint.',
    'home.approach.feature2.title': 'Energy Efficiency',
    'home.approach.feature2.description': 'Our designs incorporate renewable energy solutions and optimal thermal performance.',
    'home.approach.feature3.title': 'Biophilic Design',
    'home.approach.feature3.description': 'We integrate natural elements to create spaces that enhance wellbeing and productivity.',
    'home.approach.feature4.title': 'Timeless Aesthetics',
    'home.approach.feature4.description': 'Beautiful, enduring designs that transcend trends and reduce the need for future renovations.',
    'home.services.title': 'Comprehensive Design Services',
    'home.services.description': 'From initial concept to final implementation, we offer a complete range of architectural and interior design services tailored to your needs.',
    'home.services.feature1.title': 'Architectural Design',
    'home.services.feature1.description': 'Innovative, sustainable structures that harmonize with their surroundings.',
    'home.services.feature2.title': 'Interior Design',
    'home.services.feature2.description': 'Thoughtfully crafted spaces that reflect your personality and values.',
    'home.services.feature3.title': 'Eco-Renovation',
    'home.services.feature3.description': 'Transform existing spaces into sustainable, energy-efficient environments.',
    'home.services.feature4.title': 'Project Management',
    'home.services.feature4.description': 'Comprehensive oversight ensuring your project is completed on time and within budget.',
    'home.testimonials.title': 'What Our Clients Say',
    'home.testimonials.description': 'Hear from those who have experienced the transformative impact of our sustainable design approach.',
    'home.cta.title': 'Ready to Transform Your Space?',
    'home.cta.description': 'Let\'s collaborate to create a sustainable, beautiful environment that reflects your values and enhances your quality of life.',
    'home.cta.button': 'Schedule a Consultation',

    // About Page
    'about.hero.title': 'About Miuca',
    'about.hero.subtitle': 'Sustainable architecture and interior design for a better future',
    'about.story.title': 'Our Story',
    'about.story.p1': 'Founded in 2010, Miuca was born from a simple yet powerful vision: to create beautiful spaces that respect and enhance our natural environment. What began as a small studio with a handful of passionate designers has grown into a leading sustainable architecture and interior design firm.',
    'about.story.p2': 'Our journey has been defined by a commitment to innovation, quality, and environmental responsibility. We believe that sustainable design doesn\'t mean compromising on aesthetics or functionality—rather, it\'s an opportunity to create spaces that are more harmonious, efficient, and connected to the world around us.',
    'about.story.p3': 'Today, our diverse team of architects, designers, and sustainability experts continues to push the boundaries of eco-conscious design, creating spaces that inspire and endure.',
    'about.values.title': 'Our Values',
    'about.values.subtitle': 'The principles that guide our work and define our approach to sustainable design',
    'about.values.value1.title': 'Environmental Stewardship',
    'about.values.value1.description': 'We design with the planet in mind, minimizing ecological footprints and maximizing resource efficiency.',
    'about.values.value2.title': 'Human-Centered Design',
    'about.values.value2.description': 'We create spaces that enhance wellbeing, foster connection, and respond to human needs and behaviors.',
    'about.values.value3.title': 'Excellence & Innovation',
    'about.values.value3.description': 'We pursue the highest standards of design and craftsmanship, constantly exploring new ideas and technologies.',
    'about.values.value4.title': 'Longevity & Durability',
    'about.values.value4.description': 'We design for the long term, creating spaces that are timeless, adaptable, and built to last.',
    'about.team.title': 'Meet Our Team',
    'about.team.subtitle': 'The talented professionals behind our sustainable design solutions',
    'about.cta.title': 'Ready to Work With Us?',
    'about.cta.description': 'Let\'s collaborate to create sustainable, beautiful spaces that reflect your values and enhance your quality of life.',
    'about.cta.button': 'Get in Touch',

    // Projects Page
    'projects.hero.title': 'Our Projects',
    'projects.hero.subtitle': 'Explore our sustainable architecture and interior design portfolio',
    'projects.categories.all': 'All',
    'projects.categories.residential': 'Residential',
    'projects.categories.commercial': 'Commercial',
    'projects.categories.renovation': 'Renovation',
    'projects.categories.interiorDesign': 'Interior Design',
    'projects.empty': 'No projects found in this category.',
    'projects.cta.title': 'Have a project in mind?',
    'projects.cta.description': 'Let\'s discuss how we can create a sustainable, beautiful space tailored to your needs.',
    'projects.cta.button': 'Get in Touch',

    // Project Detail Page
    'project.overview': 'Project Overview',
    'project.challenge': 'The Challenge',
    'project.solution': 'Our Solution',
    'project.details': 'Project Details',
    'project.location': 'Location',
    'project.yearCompleted': 'Year Completed',
    'project.sustainableFeatures': 'Sustainable Features',
    'project.gallery': 'Project Gallery',
    'project.previousProject': 'Previous Project',
    'project.nextProject': 'Next Project',
    'project.cta.title': 'Inspired by this project?',
    'project.cta.description': 'Let\'s discuss how we can create a sustainable, beautiful space tailored to your needs.',
    'project.cta.button': 'Contact Us',

    // Blog Page
    'blog.hero.title': 'Our Blog',
    'blog.hero.subtitle': 'Insights, ideas, and inspiration for sustainable living',
    'blog.categories.all': 'All',
    'blog.categories.sustainableDesign': 'Sustainable Design',
    'blog.categories.ecoMaterials': 'Eco Materials',
    'blog.categories.greenLiving': 'Green Living',
    'blog.categories.architectureTrends': 'Architecture Trends',
    'blog.empty': 'No blog posts found in this category.',
    'blog.readMore': 'Read More',

    // Blog Post Page
    'blogPost.tags': 'Tags:',
    'blogPost.share': 'Share this article:',
    'blogPost.previousArticle': 'Previous Article',
    'blogPost.nextArticle': 'Next Article',
    'blogPost.relatedArticles': 'Related Articles',
    'blogPost.categories': 'Categories',

    // Contact Page
    'contact.hero.title': 'Contact Us',
    'contact.hero.subtitle': 'Get in touch to discuss your sustainable design project',
    'contact.getInTouch': 'Get In Touch',
    'contact.description': 'We\'d love to hear from you. Whether you\'re interested in our services, have a question about sustainable design, or want to discuss a potential project, our team is here to help.',
    'contact.visitUs': 'Visit Us',
    'contact.callUs': 'Call Us',
    'contact.emailUs': 'Email Us',
    'contact.officeHours': 'Office Hours',
    'contact.sendMessage': 'Send Us a Message',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.faq.title': 'Frequently Asked Questions',
    'contact.faq.subtitle': 'Find answers to common questions about our services and process',
    'contact.faq.q1': 'What makes your design approach sustainable?',
    'contact.faq.a1': 'Our sustainable design approach integrates energy-efficient systems, eco-friendly materials, and biophilic elements to create spaces that minimize environmental impact while maximizing comfort and wellbeing.',
    'contact.faq.q2': 'How long does a typical project take?',
    'contact.faq.a2': 'Project timelines vary depending on scope and complexity. A residential renovation might take 3-6 months, while a new construction project could take 12-18 months from concept to completion.',
    'contact.faq.q3': 'Do you work with existing buildings?',
    'contact.faq.a3': 'Yes, we specialize in eco-renovations that transform existing spaces into sustainable, energy-efficient environments. We believe that repurposing existing structures is often the most environmentally responsible approach.',
    'contact.faq.q4': 'What areas do you serve?',
    'contact.faq.a4': 'We primarily serve clients in Europe and North America, but we\'re open to discussing projects in other regions. Our team has experience working internationally and can adapt to various contexts and requirements.',
    'contact.faq.q5': 'How do I get started with my project?',
    'contact.faq.a5': 'The first step is to schedule an initial consultation where we\'ll discuss your vision, needs, and budget. From there, we\'ll develop a proposal outlining our approach, timeline, and fee structure for your consideration.',

    // Client Area
    'clientArea.hero.title': 'Client Area',
    'clientArea.hero.subtitle': 'Access your project information and communicate with our team',
    'clientArea.welcome': 'Welcome to Your Client Portal',
    'clientArea.description': 'Our client portal provides you with secure access to your project information, allowing you to:',
    'clientArea.feature1': 'View real-time project progress and updates',
    'clientArea.feature2': 'Access project documents and plans',
    'clientArea.feature3': 'Browse your project\'s photo gallery',
    'clientArea.feature4': 'Communicate directly with your project team',
    'clientArea.feature5': 'Track material selections and decisions',
    'clientArea.feature6': 'Monitor your project\'s sustainability metrics',
    'clientArea.noCredentials': 'If you don\'t have login credentials yet, please contact your project manager or email us at',
    'clientArea.features.title': 'Client Portal Features',
    'clientArea.features.subtitle': 'Designed to enhance your experience and keep you informed throughout your project',
    'clientArea.features.feature1.title': 'Project Dashboard',
    'clientArea.features.feature1.description': 'Get a comprehensive overview of your project\'s status, timeline, and key metrics. Track progress in real-time and stay informed about upcoming milestones.',
    'clientArea.features.feature2.title': 'Photo Gallery',
    'clientArea.features.feature2.description': 'Access a regularly updated gallery of your project\'s progress. View high-quality images documenting each phase of construction or renovation.',
    'clientArea.features.feature3.title': 'Document Repository',
    'clientArea.features.feature3.description': 'Securely access all your project documents, including plans, contracts, specifications, and material selections, all organized for easy reference.',
    'clientArea.features.feature4.title': 'Communication Hub',
    'clientArea.features.feature4.description': 'Communicate directly with your project team through our integrated messaging system. Keep all project-related discussions in one place.',
    'clientArea.features.feature5.title': 'Decision Tracker',
    'clientArea.features.feature5.description': 'Keep track of all project decisions and approvals. Review past decisions and see what choices are pending your input.',
    'clientArea.features.feature6.title': 'Sustainability Metrics',
    'clientArea.features.feature6.description': 'Monitor your project\'s environmental impact with detailed sustainability metrics, including energy efficiency, material usage, and carbon footprint.',

    // Login Form
    'login.title': 'Client Login',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',
    'login.button': 'Sign In',
    'login.noAccount': 'Don\'t have an account? Contact us to get access to your project.',

    // Client Dashboard
    'dashboard.title': 'Client Dashboard',
    'dashboard.welcome': 'Welcome back,',
    'dashboard.signOut': 'Sign Out',
    'dashboard.nav.dashboard': 'Dashboard',
    'dashboard.nav.documents': 'Documents',
    'dashboard.nav.messages': 'Messages',
    'dashboard.nav.settings': 'Settings',
    'dashboard.projects': 'Your Projects',
    'dashboard.progress': 'Progress',
    'dashboard.lastUpdated': 'Last updated:',
    'dashboard.viewDetails': 'View Details',
    'dashboard.notifications': 'Notifications',
    'dashboard.noNotifications': 'No new notifications',
    'dashboard.viewAllNotifications': 'View All Notifications',
    'dashboard.quickLinks': 'Quick Links',
    'dashboard.quickLink1': 'Upload Documents',
    'dashboard.quickLink2': 'Schedule a Meeting',
    'dashboard.quickLink3': 'View Project Calendar',
    'dashboard.quickLink4': 'Contact Your Project Manager',

    // Client Project Page
    'clientProject.backToDashboard': 'Back to Dashboard',
    'clientProject.projectId': 'Project ID:',
    'clientProject.messageTeam': 'Message Team',
    'clientProject.scheduleMeeting': 'Schedule Meeting',
    'clientProject.overview': 'Project Overview',
    'clientProject.startDate': 'Start Date',
    'clientProject.estimatedCompletion': 'Estimated Completion',
    'clientProject.projectManager': 'Project Manager',
    'clientProject.progress': 'Project Progress',
    'clientProject.gallery': 'Project Gallery',
    'clientProject.team': 'Project Team',
    'clientProject.documents': 'Project Documents',
    'clientProject.updates': 'Recent Updates',

    // Project Progress Component
    'projectProgress.title': 'Project Progress',
    'projectProgress.overallProgress': 'Overall Progress',
    'projectProgress.start': 'Start',
    'projectProgress.estimatedCompletion': 'Estimated Completion',
    'projectProgress.projectPhases': 'Project Phases',
    'projectProgress.completed': 'Completed',
    'projectProgress.inProgress': 'In Progress',
    'projectProgress.pending': 'Pending',
    'projectProgress.materialsBreakdown': 'Materials Breakdown',
    'projectProgress.recycled': 'Recycled',
    'projectProgress.recycledMaterials': 'Recycled Materials',

    // Footer
    'footer.description': 'Sustainable architecture and interior design solutions that respect the environment while creating beautiful living spaces.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.service1': 'Sustainable Architecture',
    'footer.service2': 'Interior Design',
    'footer.service3': 'Eco-Renovation',
    'footer.service4': 'Consultation',
    'footer.service5': 'Project Management',
    'footer.contactUs': 'Contact Us',
    'footer.copyright': 'All rights reserved.',

    // Language
    'language': 'Language',
    'language.english': 'English',
    'language.french': 'French',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.projects': 'Projets',
    'nav.about': 'L\'agence',
    'nav.blog': 'Blog',
    'nav.pricing': 'Tarifs',
    'nav.contact': 'Contact',
    'nav.clientArea': 'Espace Client',
    'nav.residential': 'Résidentiel',
    'nav.commercial': 'Commercial',
    'nav.allProjects': 'Tous les Projets',

/////////////////// Testimonials///////////////////////
    'part.testimonials.quote1': "Nous avons été impressionnés par la vision de Miuca : une architecture sobre, élégante et parfaitement en phase avec nos attentes. Chaque étape a été fluide et rassurante.",
    'part.testimonials.author1': "Claire D.",
    'part.testimonials.role1': "Cliente résidentielle à Toulouse",
    
    'part.testimonials.quote2': "Leur capacité à comprendre nos besoins et à les transformer en espaces fonctionnels et inspirants a été un vrai plus. Un accompagnement haut de gamme, du début à la fin.",
    'part.testimonials.author2': "Antoine M.",
    'part.testimonials.role2': "Responsable projet tertiaire",
    
    'part.testimonials.quote3': "Avec Miuca, on ne parle pas seulement de plans, mais de projets de vie. Leur approche humaine et sur mesure fait toute la différence.",
    'part.testimonials.author3': "Julie T.",
    'part.testimonials.role3': "Propriétaire d'un bien à rénover",
    
    'part.testimonials.quote4': "Un regard neuf et une grande écoute. Miuca a su créer un espace à notre image, tout en restant dans notre budget.",
    'part.testimonials.author4': "Samuel et Inès L.",
    'part.testimonials.role4': "Jeunes parents primo-accédants",
    
    'part.testimonials.quote5': "L'aménagement de notre cabinet a été repensé avec intelligence. Les patients et l'équipe s'y sentent beaucoup mieux.",
    'part.testimonials.author5': "Dr Thomas B.",
    'part.testimonials.role5': "Profession libérale à Montpellier",
    
    'part.testimonials.quote6': "Igor a su comprendre nos envies sans que nous ayons à trop les verbaliser. Le résultat est élégant, pratique et chaleureux.",
    'part.testimonials.author6': "Nathalie R.",
    'part.testimonials.role6': "Enseignante, projet de rénovation",
    
    'part.testimonials.quote7': "Un vrai sens du détail et un respect total des délais. Une belle collaboration pour notre résidence secondaire.",
    'part.testimonials.author7': "Vincent et Laura C.",
    'part.testimonials.role7': "Couple parisien investissant dans le sud",
    
    'part.testimonials.quote8': "Très satisfait du suivi. Miuca a su gérer les imprévus avec beaucoup de réactivité et de professionnalisme.",
    'part.testimonials.author8': "Hugo F.",
    'part.testimonials.role8': "Jeune entrepreneur",
    
    'part.testimonials.quote9': "Des idées originales, un style épuré et une vraie rigueur. Le projet a dépassé nos attentes.",
    'part.testimonials.author9': "Agnès M.",
    'part.testimonials.role9': "Retraitée active",
    
    'part.testimonials.quote10': "Un projet ambitieux mené avec douceur et clarté. Je me suis sentie en confiance tout au long du processus.",
    'part.testimonials.author10': "Fatou D.",
    'part.testimonials.role10': "Mère de famille, cliente à Narbonne",
    
    'part.testimonials.quote11': "Nous cherchions à valoriser notre bien pour la location. Résultat : un espace optimisé et très bien accueilli par nos locataires.",
    'part.testimonials.author11': "Jean-Pierre et Louise R.",
    'part.testimonials.role11': "Propriétaires bailleurs",
    
    'part.testimonials.quote12': "Miuca a été un partenaire précieux dans la rénovation de notre boutique. L'identité visuelle et l'ergonomie sont au top.",
    'part.testimonials.author12': "Emma G.",
    'part.testimonials.role12': "Commerçante indépendante",
    
    'part.testimonials.quote13': "L'accompagnement a été fluide, rassurant et toujours très humain. Je recommande sans hésiter.",
    'part.testimonials.author13': "Benoît D.",
    'part.testimonials.role13': "Directeur de projet immobilier",
    
    'part.testimonials.quote14': "Le style de Miuca nous a tout de suite plu : raffiné, simple, sans en faire trop. Exactement ce qu'il nous fallait.",
    'part.testimonials.author14': "Camille V.",
    'part.testimonials.role14': "Jeune couple propriétaire",
    
    'part.testimonials.quote15': "Miuca a su réorganiser complètement notre espace de vie. C'est un vrai renouveau pour toute la famille.",
    'part.testimonials.author15': "Karine B.",
    'part.testimonials.role15': "Maman de trois enfants",
    
    'part.testimonials.quote16': "Une approche très professionnelle mais jamais froide. L'écoute et la sensibilité d'Igor font toute la différence.",
    'part.testimonials.author16': "Michel P.",
    'part.testimonials.role16': "Client à Carcassonne",
    
    'part.testimonials.quote17': "Grâce à Miuca, notre petite surface a gagné en fonctionnalité et en charme. Un vrai coup de maître.",
    'part.testimonials.author17': "Lucie T.",
    'part.testimonials.role17': "Locataire souhaitant optimiser son espace",
    
    'part.testimonials.quote18': "Le projet a été respecté à la lettre, avec une grande attention au détail et un suivi irréprochable.",
    'part.testimonials.author18': "Arnaud C.",
    'part.testimonials.role18': "Investisseur immobilier",
    
    'part.testimonials.quote19': "Je recommande vivement Miuca pour son sérieux, sa créativité et sa capacité à s'adapter à chaque situation.",
    'part.testimonials.author19': "Sophie H.",
    'part.testimonials.role19': "Chargée de communication",
    
    'part.testimonials.quote20': "Chaque échange a été simple, clair et efficace. Le résultat : un intérieur qui me ressemble vraiment.",
    'part.testimonials.author20': "Yasmine A.",
    'part.testimonials.role20': "Consultante indépendante",

/////////////////// Home Page ///////////////////////
    'home.hero.title': 'Architecture & Design d\'Intérieur Durables',
    'home.hero.subtitle': 'Reinventer l\'espace, repenser l\'impact',
    'home.intro.title': 'Concevoir des Avenirs Durables',
    'home.intro.subtitle': 'Nous concevons des intérieurs sur mesure qui reflètent votre personnalité et répondent à vos besoins.',
    'home.intro.description': 'Miuca, votre partenaire en architecture d\'intérieur à Toulouse, transforme vos espaces en lieux uniques alliant esthétique, eco-responsabilité et fonctionnalité.',
    'home.intro.button1': 'Explorez nos réalisations',
    'home.intro.button2': 'Discutons de votre projet',
    'home.projects.title': 'Nos projets',
    'home.projects.description': 'Découvrez nos conceptions les plus innovantes et durables qui témoignent de notre engagement envers une architecture respectueuse de l\'environnement.',
    'home.projects.viewAll': 'Voir Tous les Projets',
    'home.approach.title': 'Notre Approche de Conception',
    'home.approach.description': 'Chez Miuca, chaque projet est conçu avec exigence et sens du détail. Nous privilégions une approche globale qui associe innovation, confort et élégance, pour donner vie à des espaces harmonieux et fonctionnels. Nos choix techniques et esthétiques visent la qualité durable, dans le respect des attentes de nos clients et des spécificités du site.',
    'home.approach.feature1.title': 'Matériaux de Qualité',
    'home.approach.feature1.description': 'Nous sélectionnons avec soin des matériaux fiables, solides et adaptés à chaque projet. L\'accent est mis sur la pérennité, l\'authenticité et la cohérence architecturale, afin de garantir un rendu à la hauteur de vos exigences et un confort optimal au quotidien.',
    'home.approach.feature2.title': 'Performance et Confort Thermique',
    'home.approach.feature2.description': 'Nos conceptions intègrent les solutions techniques les plus adaptées pour assurer une excellente performance thermique. Que ce soit pour la fraîcheur en été ou la chaleur en hiver, l\'isolation, l\'orientation et les équipements sont pensés pour un confort optimal tout au long de l\'année.',
    'home.approach.feature3.title': 'Connexion avec l\'Environnement',
    'home.approach.feature3.description': 'L\'agencement intérieur et la lumière naturelle jouent un rôle essentiel dans nos projets. Nous intégrons des éléments végétaux et des matières nobles, créant une atmosphère apaisante et vivante qui favorise le bien-être et l\'équilibre.',
    'home.approach.feature4.title': 'Élégance et Esthétique Intemporelle',
    'home.approach.feature4.description': 'L\'agencement intérieur et la lumière naturelle jouent un rôle essentiel dans nos projets. Nous intégrons des éléments végétaux et des matières nobles, créant une atmosphère apaisante et vivante qui favorise le bien-être et l\'équilibre.',
    'home.services.title': 'Accompagnement Global sur Mesure',
    'home.services.description': 'Chez Miuca, nous vous accompagnons de la première esquisse jusqu\'à la livraison finale. Grâce à notre savoir-faire transversal en architecture et en design d\'intérieur, nous concevons des projets cohérents, maîtrisés et adaptés à vos objectifs, quels que soient leur nature ou leur échelle.',
    'home.services.feature1.title': 'Conception Architecturale',
    'home.services.feature1.description': 'Nous imaginons des structures contemporaines et élégantes, parfaitement intégrées à leur contexte. Chaque projet est pensé pour refléter une identité forte, alliant esthétisme, technicité et fonctionnalité, tout en s\'adaptant aux contraintes du site et aux attentes des utilisateurs.',
    'home.services.feature2.title': 'Design d\'Intérieur',
    'home.services.feature2.description': 'Du mobilier à la lumière, nous créons des espaces intérieurs sur mesure, conçus pour sublimer votre cadre de vie ou de travail. Nos solutions valorisent la clarté, la fluidité et le confort, pour une ambiance harmonieuse et personnalisée.',
    'home.services.feature3.title': 'Rénovation "éco" réfléchie',
    'home.services.feature3.description': 'Nous redonnons vie à des bâtiments ou des intérieurs existants en leur apportant modernité, cohérence et confort. Chaque intervention est pensée pour optimiser les espaces et améliorer l\'usage au quotidien, tout en respectant l\'esprit des lieux.',
    'home.services.feature4.title': 'Gestion de Projet',
    'home.services.feature4.description': 'Avec une coordination rigoureuse et transparente, nous assurons le suivi complet de votre chantier. Objectif : garantir un résultat conforme à vos attentes, dans les délais impartis et en maîtrisant les coûts à chaque étape.',
    'home.testimonials.title': 'Ce que Disent Nos Clients',
    'home.testimonials.description': 'Écoutez ceux qui ont expérimenté l\'impact transformateur de notre approche de conception durable.',
    'home.cta.title': 'Prêt à Transformer Votre Espace ?',
    'home.cta.description': 'Collaborons pour créer un environnement durable et magnifique qui reflète vos valeurs et améliore votre qualité de vie.',
    'home.cta.button': 'Voyez comment vos idées peuvent prendre vie',

/////////////////// About Page ///////////////////////
    'about.hero.title': 'L\'agence Miuca',
    'about.hero.subtitle': 'Architecture et design  d\'intérieur durables pour un avenir meilleur',
    'about.story.title': 'Notre Histoire',
    'about.story.p1': 'Je m’appelle Igor Brousse. Après un parcours de 15 années dans les univers de l’informatique et de la création, j’ai choisi de revenir à ce qui m’anime profondément depuis le lycée : l’architecture d’intérieur. En 2021, ce rêve est devenu un projet concret avec la naissance de Miuca, une agence à mon image, où se rencontrent design, intuition artistique et sens du détail.',
    'about.story.p2': 'Fort d\'une formation solide et d\'un diplôme reconnu par l\'État en architecture d’intérieur et design d’espace , j’ai développé une sensibilité particulière pour la composition, la lumière et les volumes, nourrie aussi par ma passion pour la photographie et l’art contemporain.',
    'about.story.subtitle': '"La nature a une place importante dans ma vie de tous les jours"',
    'about.story.p3': 'Installé en région toulousaine, j’interviens dans toute l’Occitanie, aussi bien pour des projets résidentiels que professionnels. Chaque mission est une collaboration : le client est pleinement acteur de son projet, et c’est ce dialogue qui donne naissance à des lieux uniques, cohérents et durables.',
    'about.values.title': 'Nos Valeurs chez Miuca',
    'about.values.subtitle': 'Les principes qui guident notre travail et définissent notre approche du design durable',
    'about.values.value1.title': 'Maîtrise Responsable',
    'about.values.value1.description': 'Chaque projet est pensé avec soin pour optimiser les ressources, les coûts et les usages, sans compromis sur la qualité ou l\'esthétique.',
    'about.values.value2.title': 'Design Centré sur l\'Humain',
    'about.values.value2.description': 'Nous créons des espaces qui favorisent le confort, l\'harmonie et la fonctionnalité, en phase avec les modes de vie contemporains.',
    'about.values.value3.title': 'Excellence & Innovation',
    'about.values.value3.description': 'Nous repoussons les limites du design et de la technique pour offrir des solutions uniques, performantes et élégantes.',
    'about.values.value4.title': 'Pérennité & Élégance',
    'about.values.value4.description': 'Nos réalisations sont conçues pour traverser le temps, en misant sur la simplicité, la cohérence et la qualité d\'exécution.',
    'about.vision.title': 'Agence d\'aménagement intérieur',
    'about.vision.subtitle': 'Les professionnels talentueux derrière nos solutions de design durable',
    'about.vision.p1': 'Chez Miuca, nous portons une vision claire : créer des espaces qui respirent, qui renouent avec l’essentiel, et qui allient esthétique, confort et fonctionnalité. Nous cherchons à donner un nouveau souffle aux intérieurs, en intégrant des éléments naturels, des matériaux de qualité, et une approche raisonnée de la conception.',
    'about.vision.p2': 'Notre mission est simple : proposer des solutions personnalisées, pensées pour durer, et accessibles, sans jamais renoncer à la qualité ni au style.',
    'about.cta.title': 'Prêt à Travailler Avec Nous ?',
    'about.cta.description': 'Collaborons pour créer des espaces durables et magnifiques qui reflètent vos valeurs et améliorent votre qualité de vie.',
    'about.cta.button': 'Parlez-en ensemble',

/////////////////// Pricing Page ///////////////////////
    'pricing.hero.title': 'Un intérieur réfléchi, à prix maîtrisé',
    'pricing.hero.subtitle': 'Des formules équilibrées, entre précision, confort et créativité',
    'pricing.introduction.subtitle': 'Chez MUICA, nous croyons en une tarification juste et transparente. Nos forfaits sont conçus pour s\'adapter à vos besoins tout en respectant notre engagement envers l\'environnement. Chaque projet intègre des solutions durables et des matériaux éco-responsables, sans compromis sur le style.',
    // Forfaits Graine
    'pricing.package.50.title': 'Forfait Graine',
    'pricing.package.50.subtitle': 'Définir & visualiser votre concept',
    'pricing.package.50.description': 'Sublimer vos envies en esquisses raffinées et visuels 3D, pour confirmer l’atmosphère unique de votre espace et maîtriser sereinement votre budget.', 
    'pricing.package.50.feature1': 'Rendez-vous conseil ( à distance ou sur place',
    'pricing.package.50.feature2': 'Analyse de l\'espace et des besoins',
    'pricing.package.50.feature3': 'Moodboard d\'ambiance + palette couleurs/matières',
    'pricing.package.50.feature4': 'Proposition d\'agencement simplifié (plan 2D)',
    'pricing.package.50.feature5': 'Suggestions mobilier et décoration',
    // Forfaits Jeune Pouce    
    'pricing.package.100.title': 'Forfait Jeune Pouce',
    'pricing.package.100.subtitle': 'Poser les bases créatives et techniques',
    'pricing.package.100.description': 'Transformer vos souhaits en esquisses élégantes – plan 2D épuré, planches d’ambiance inspirantes, shopping-list sur-mesure & rendus 3D – pour valider votre agencement parfait.',
    'pricing.package.100.feature1': "Contenu Graine + ",
    'pricing.package.100.feature2': 'Dossier synthèse comprenant :',
    'pricing.package.100.feature3': "Visite sur site + prises de cotes",
    'pricing.package.100.feature4': "Conception complète : Plans 2D, planche de style & sélection matériaux/mobilier",
    'pricing.package.100.feature5': "Visuel d'ambiance (croquis ou 3D simple)",
    'pricing.package.100.feature6': "Liste shopping et conseils",
    
    // Forfaits Cime    
    'pricing.package.150.title': 'Forfait Cime',
    'pricing.package.150.subtitle': 'Une vue d’ensemble, une transformation architecturale complète',
    'pricing.package.150.description': 'Accompagnement intégral pour vos espaces : du concept à la mise en œuvre, avec plans techniques détaillés, mobilier sur mesure et rendus 3D photoréalistes.',
    'pricing.package.150.feature1': "Contenu Jeune Pouce + ",
    'pricing.package.150.feature2': "Plans techniques(élévations, coupes, électricité, plomberie)",
    'pricing.package.150.feature3': "Mobilier sur mesure",
    'pricing.package.150.feature4': "Modélisation 3D & visuels photoréalistes (2 à 3 points de vue par pièce)",
    
    'pricing.package.button': 'Je prends ce forfait',
    // FAQ
    'pricing.faq.subtitle': ' Questions Régulières',
    'pricing.faq1.question': "Comment intégrez-vous l'éco-responsabilité dans vos projets ?",
    'pricing.faq1.answer': "Nous intégrons l'éco-responsabilité à chaque étape du projet, de la sélection des matériaux durables à l'optimisation énergétique.",
    'pricing.faq2.question': "Puis-je personnaliser mon forfait ?",
    'pricing.faq2.answer': "Oui, tous nos forfaits peuvent être adaptés à vos besoins spécifiques.",
    'pricing.faq3.question': "Quels types de projets réalisez-vous ?",
    'pricing.faq3.answer': "Résidentiels et commerciaux : rénovations, constructions neuves, aménagements intérieurs.",
    'pricing.faq4.question': "Quelle est la durée moyenne d'un projet ?",
    'pricing.faq4.answer': "En général 3 à 6 mois pour un résidentiel, jusqu'à 12 mois pour un projet commercial.",
    'pricing.faq5.question': "Comment se déroule la première consultation ?",
    'pricing.faq5.answer': "Visite sur site ou visioconférence, échange sur vos besoins, suivi d'une proposition personnalisée.",

    'pricing.concept1.title': 'Design Sur Mesure',
    'pricing.concept1.description': 'Des solutions pensées pour allier esthétisme, fonctionnalité et cohérence avec vos attentes.',
    'pricing.concept2.title': 'Engagement Qualité',
    'pricing.concept2.description': 'Chaque projet bénéficie d\'une attention rigoureuse et d\'un haut niveau d\'exigence à chaque étape.',
    'pricing.concept3.title': 'Accompagnement Personnalisé',
    'pricing.concept3.description': 'Une prise en charge attentive, avec un interlocuteur unique pour un suivi fluide et réactif de votre projet.',

    'pricing.testimonials.title': 'Ce que Disent Nos Clients',
    'pricing.testimonials.description': 'Écoutez ceux qui ont expérimenté l\'impact transformateur de notre approche de conception durable.',

    'pricing.cta.title': 'Prêt à Transformer Votre Espace ?',
    'pricing.cta.description': 'Collaborons pour créer un environnement durable et magnifique qui reflète vos valeurs et améliore votre qualité de vie.',
    'pricing.cta.button': 'Voyons comment vos idées peuvent prendre vie',

    
/////////////////// Projects Page ///////////////////////
    'projects.hero.title': 'Nos Projets',
    'projects.hero.subtitle': 'Explorez notre portfolio d\'architecture de design d\'intérieur durables',
    'projects.category.residential': 'Résidentiel',
    'projects.category.commercial': 'Commercial',
    'projects.empty': 'Aucun projet trouvé dans cette catégorie.',
    'projects.cta.title': 'Vous avez un projet en tête ?',
    'projects.cta.description': 'Discutons ensemble de vos idées. Contactez-nous pour une consultation et découvrez comment nous pouvons donner vie à votre vision.',
    'projects.cta.button': 'Donnons vie à votre espace',

///////////////////  Project Detail Page /////////////////// 
    'project.overview': 'Aperçu du Projet',
    'project.challenge': 'Le Défi',
    'project.solution': 'Notre Solution',
    'project.details': 'Détails du Projet',
    'project.location': 'Emplacement',
    'project.yearCompleted': 'Année d\'Achèvement',
    'project.sustainableFeatures': 'Caractéristiques Durables',
    'project.gallery': 'Galerie du Projet',
    'project.previousProject': 'Projet Précédent',
    'project.nextProject': 'Projet Suivant',
    'project.cta.title': 'Inspiré par ce projet ?',
    'project.cta.description': 'Discutons de la façon dont nous pouvons créer un espace durable et magnifique adapté à vos besoins.',
    'project.cta.button': 'Contactez-Nous',

/////////////////// / Blog Page /////////////////// 
    'blog.hero.title': 'Notre Blog',
    'blog.hero.subtitle': 'Idées, inspirations et conseils pour un mode de vie durable',
    'blog.categories.all': 'Tous',
    'blog.categories.sustainableDesign': 'Design Durable',
    'blog.categories.ecoMaterials': 'Matériaux Écologiques',
    'blog.categories.greenLiving': 'Vie Écologique',
    'blog.categories.architectureTrends': 'Tendances Architecture',
    'blog.empty': 'Aucun article trouvé dans cette catégorie.',
    'blog.readMore': 'Lire Plus',

///////////////////  Blog Post Page /////////////////// 
    'blogPost.tags': 'Tags :',
    'blogPost.share': 'Partager cet article :',
    'blogPost.previousArticle': 'Article Précédent',
    'blogPost.nextArticle': 'Article Suivant',
    'blogPost.relatedArticles': 'Articles Connexes',
    'blogPost.categories': 'Catégories',

///////////////////  Contact Page /////////////////// 
    'contact.hero.title': 'Contactez-nous',
    'contact.hero.subtitle': 'Prenez contact pour discuter de votre projet de design durable',
    'contact.getInTouch': 'Prenez Contact',
    'contact.description': 'Nous serions ravis d\'avoir de vos nouvelles. Que vous soyez intéressé par nos services, que vous ayez une question sur le design durable, ou que vous souhaitiez discuter d\'un projet potentiel, notre équipe est là pour vous aider.',
    'contact.visitUs': 'Visitez-nous',
    'contact.callUs': 'Appelez-nous',
    'contact.emailUs': 'Envoyez-nous un Email',
    'contact.officeHours': 'Heures d\'ouverture',
    'contact.sendMessage': 'Envoyez-nous un Message',
    'contact.form.name': 'Nom Complet',
    'contact.form.email': 'Adresse Email',
    'contact.form.phone': 'Téléphone',
    'contact.form.superficie': 'Superficie de l\'espace à aménager',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Envoi du message',
    // FAQ    
    'contact.faq.title': 'Questions fréquemment posées',
    'contact.faq.subtitle': 'Trouvez des réponses aux questions courantes sur nos services et notre processus',
    'contact.faq1.question': 'Travaillez-vous avec des bâtiments existants ?',
    'contact.faq1.answer': 'Oui, nous nous spécialisons dans les éco-rénovations qui transforment les espaces existants en environnements durables et économes en énergie. Nous croyons que la réutilisation des structures existantes est souvent l\'approche la plus responsable sur le plan environnemental.',
    'contact.faq2.question': 'Quelles régions desservez-vous ?',
    'contact.faq2.answer': 'Nous servons principalement des clients en de la region toulousaine (là où nous sommes basés), mais nous sommes toujours ouverts pourréaliser de beaux projets dans d\'autres régions.',
    'contact.faq3.question': "Quels types de projets réalisez-vous ?",
    'contact.faq3.answer': "Résidentiels et commerciaux : rénovations, constructions neuves, aménagements intérieurs.",
    'contact.faq4.question': 'Comment puis-je démarrer mon projet ?',
    'contact.faq4.answer': 'La première étape consiste à planifier une consultation initiale où nous discuterons de votre vision, de vos besoins et de votre budget. À partir de là, nous développerons une proposition décrivant notre approche, le calendrier et la structure des frais par rapport à votre projet.',


///////////////////  Client Area /////////////////// 
    'clientArea.hero.title': 'Espace Client',
    'clientArea.hero.subtitle': 'Accédez à vos informations de projet et communiquez avec notre équipe',
    'clientArea.welcome': 'Bienvenue dans Votre Portail Client',
    'clientArea.description': 'Notre portail client vous donne un accès sécurisé à vos informations de projet, vous permettant de :',
    'clientArea.feature1': 'Voir l\'avancement du projet et les mises à jour en temps réel',
    'clientArea.feature2': 'Accéder aux documents et plans du projet',
    'clientArea.feature3': 'Parcourir la galerie photo de votre projet',
    'clientArea.feature4': 'Communiquer directement avec votre équipe de projet',
    'clientArea.feature5': 'Suivre les sélections de matériaux et les décisions',
    'clientArea.feature6': 'Surveiller les métriques de durabilité de votre projet',
    'clientArea.noCredentials': 'Si vous n\'avez pas encore d\'identifiants de connexion, veuillez contacter votre chef de projet ou nous envoyer un email à',
    'clientArea.features.title': 'Fonctionnalités du Portail Client',
    'clientArea.features.subtitle': 'Conçu pour améliorer votre expérience et vous tenir informé tout au long de votre projet',
    'clientArea.features.feature1.title': 'Tableau de Bord du Projet',
    'clientArea.features.feature1.description': 'Obtenez une vue d\'ensemble complète du statut, du calendrier et des métriques clés de votre projet. Suivez les progrès en temps réel et restez informé des prochaines étapes importantes.',
    'clientArea.features.feature2.title': 'Galerie Photo',
    'clientArea.features.feature2.description': 'Accédez à une galerie régulièrement mise à jour de l\'avancement de votre projet. Visualisez des images de haute qualité documentant chaque phase de construction ou de rénovation.',
    'clientArea.features.feature3.title': 'Dépôt de Documents',
    'clientArea.features.feature3.description': 'Accédez en toute sécurité à tous vos documents de projet, y compris les plans, contrats, spécifications et sélections de matériaux, tous organisés pour une référence facile.',
    'clientArea.features.feature4.title': 'Centre de Communication',
    'clientArea.features.feature4.description': 'Communiquez directement avec votre équipe de projet via notre système de messagerie intégré. Gardez toutes les discussions liées au projet en un seul endroit.',
    'clientArea.features.feature5.title': 'Suivi des Décisions',
    'clientArea.features.feature5.description': 'Gardez une trace de toutes les décisions et approbations du projet. Révisez les décisions passées et voyez quels choix attendent votre contribution.',
    'clientArea.features.feature6.title': 'Métriques de Durabilité',
    'clientArea.features.feature6.description': 'Surveillez l\'impact environnemental de votre projet avec des métriques de durabilité détaillées, y compris l\'efficacité énergétique, l\'utilisation des matériaux et l\'empreinte carbone.',

/////////////////// Login Form /////////////////// 
    'login.title': 'Connexion Client',
    'login.email': 'Adresse Email',
    'login.password': 'Mot de Passe',
    'login.remember': 'Se souvenir de moi',
    'login.forgot': 'Mot de passe oublié ?',
    'login.button': 'Se Connecter',
    'login.noAccount': 'Vous n\'avez pas de compte ? Contactez-nous pour obtenir l\'accès à votre projet.',

/////////////////// Client Dashboard /////////////////// 
    'dashboard.title': 'Tableau de Bord Client',
    'dashboard.welcome': 'Bienvenue,',
    'dashboard.signOut': 'Déconnexion',
    'dashboard.nav.dashboard': 'Tableau de Bord',
    'dashboard.nav.documents': 'Documents',
    'dashboard.nav.messages': 'Messages',
    'dashboard.nav.settings': 'Paramètres',
    'dashboard.projects': 'Vos Projets',
    'dashboard.progress': 'Progression',
    'dashboard.lastUpdated': 'Dernière mise à jour :',
    'dashboard.viewDetails': 'Voir les Détails',
    'dashboard.notifications': 'Notifications',
    'dashboard.noNotifications': 'Aucune nouvelle notification',
    'dashboard.viewAllNotifications': 'Voir Toutes les Notifications',
    'dashboard.quickLinks': 'Liens Rapides',
    'dashboard.quickLink1': 'Télécharger des Documents',
    'dashboard.quickLink2': 'Planifier une Réunion',
    'dashboard.quickLink3': 'Voir le Calendrier du Projet',
    'dashboard.quickLink4': 'Contacter Votre Chef de Projet',

/////////////////// Client Project Page /////////////////// 
    'clientProject.backToDashboard': 'Retour au Tableau de Bord',
    'clientProject.projectId': 'ID du Projet :',
    'clientProject.messageTeam': 'Contacter l\'Équipe',
    'clientProject.scheduleMeeting': 'Planifier une Réunion',
    'clientProject.overview': 'Aperçu du Projet',
    'clientProject.startDate': 'Date de Début',
    'clientProject.estimatedCompletion': 'Achèvement Estimé',
    'clientProject.projectManager': 'Chef de Projet',
    'clientProject.progress': 'Progression du Projet',
    'clientProject.gallery': 'Galerie du Projet',
    'clientProject.team': 'Équipe du Projet',
    'clientProject.documents': 'Documents du Projet',
    'clientProject.updates': 'Mises à Jour Récentes',

/////////////////// Project Progress Component /////////////////// 
    'projectProgress.title': 'Progression du Projet',
    'projectProgress.overallProgress': 'Progression Globale',
    'projectProgress.start': 'Début',
    'projectProgress.estimatedCompletion': 'Achèvement Estimé',
    'projectProgress.projectPhases': 'Phases du Projet',
    'projectProgress.completed': 'Terminé',
    'projectProgress.inProgress': 'En Cours',
    'projectProgress.pending': 'En Attente',
    'projectProgress.materialsBreakdown': 'Répartition des Matériaux',
    'projectProgress.recycled': 'Recyclé',
    'projectProgress.recycledMaterials': 'Matériaux Recyclés',

/////////////////// Footer /////////////////// 
    'footer.description': 'Solutions d\'architecture et de design d\'intérieur durables qui respectent l\'environnement tout en créant de beaux espaces de vie.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.services': 'Services',
    'footer.service1': 'Architecture Durable',
    'footer.service2': 'Design d\'Intérieur',
    'footer.service3': 'Éco-Rénovation',
    'footer.service4': 'Consultation',
    'footer.service5': 'Gestion de Projet',
    'footer.contactUs': 'Contactez-Nous',
    'footer.copyright': 'Tous droits réservés.',

/////////////////// Language /////////////////// 
    'language': 'Langue',
    'language.english': 'Anglais',
    'language.french': 'Français',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('Miuca_language');
    return (savedLanguage as Language) || 'fr';
  });

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const getRandomTestimonials = (count: number): Testimonial[] => {
    const testimonials: Testimonial[] = [];
    let i = 1;
    while (true) {
      const quote = t(`part.testimonials.quote${i}`);
      const author = t(`part.testimonials.author${i}`);
      const role = t(`part.testimonials.role${i}`);
      if (!quote || quote === `part.testimonials.quote${i}`) break;
      testimonials.push({ quote, author, role });
      i++;
    }
    const shuffled = testimonials.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('Miuca_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    getRandomTestimonials
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};