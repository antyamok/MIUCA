import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Mail } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    email?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio, image, social }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
      <motion.div
        className="w-full text-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-semibold mb-2">{name}</h3>
        <p className="text-sm text-gray-500 mb-4">{role}</p>
        <p className="text-gray-700 mb-4 leading-relaxed">{bio}</p>
        <div className="flex space-x-4 text-sm text-blue-600">
          {social?.email && (
            <a href={`mailto:${social.email}`} className="hover:underline">Email</a>
          )}
          {social?.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
          )}
          {social?.instagram && (
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
          )}
        </div>
      </motion.div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <img
          src={image}
          alt={name}
          className="rounded-lg w-full h-auto object-cover"
        />
      </motion.div>
    </div>
  );
};

export default TeamMember;