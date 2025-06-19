import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface FormData {
  name: string;
  email: string;
  phone: string;
  superficie: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    // In a real app, this would send the data to an API
    alert('Thank you for your message! We will get back to you soon.');
    reset();
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="form-label">{t('contact.form.name')}</label>
          <input 
            type="text" 
            id="name" 
            className={`form-input ${errors.name ? 'border-red-500' : ''}`}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">{t('contact.form.email')}</label>
          <input 
            type="email" 
            id="email" 
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="phone" className="form-label">{t('contact.form.phone')}</label>
          <input 
            type="tel" 
            id="phone" 
            className="form-input"
            {...register('phone')}
          />
        </div>
        
        <div>
          <label htmlFor="superficie" className="form-label">{t('contact.form.superficie')}</label>
          <input 
            type="text" 
            id="superficie" 
            className={`form-input ${errors.superficie ? 'border-red-500' : ''}`}
            {...register('superficie', { required: 'Superficie is required' })}
          />
          {errors.superficie && <p className="text-red-500 text-sm mt-1">{errors.superficie.message}</p>}
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="message" className="form-label">{t('contact.form.message')}</label>
        <textarea 
          id="message" 
          rows={5} 
          className={`form-input ${errors.message ? 'border-red-500' : ''}`}
          {...register('message', { required: 'Message is required' })}
        ></textarea>
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
      </div>
      
      <button type="submit" className="btn-primary w-full">
        {t('contact.form.submit')}
      </button>
    </motion.form>
  );
};

export default ContactForm;