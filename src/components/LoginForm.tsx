import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    setIsLoading(true);
    
    try {
      const result = await login(data.email, data.password);
      if (result.success && result.redirectTo) {
        navigate(result.redirectTo);
      } else {
        setLoginError('Identifiants invalides. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setLoginError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
      <h3 className="font-lufga text-2xl mb-6 text-center">{t('login.title')}</h3>
      
      {loginError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {loginError}
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="email" className="form-label">{t('login.email')}</label>
        <input 
          type="email" 
          id="email" 
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          {...register('email', { 
            required: 'Email requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide'
            }
          })}
          disabled={isLoading}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="password" className="form-label">{t('login.password')}</label>
        <input 
          type="password" 
          id="password" 
          className={`form-input ${errors.password ? 'border-red-500' : ''}`}
          {...register('password', { required: 'Mot de passe requis' })}
          disabled={isLoading}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <input type="checkbox" id="remember" className="mr-2" disabled={isLoading} />
          <label htmlFor="remember" className="text-sm">{t('login.remember')}</label>
        </div>
        <a href="#" className="text-sm text-sage hover:text-terracotta transition-colors duration-300">
          {t('login.forgot')}
        </a>
      </div>
      
      <button 
        type="submit" 
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? 'Connexion...' : t('login.button')}
      </button>
      
      <p className="text-center mt-4 text-sm">
        {t('login.noAccount')}
      </p>
    </form>
  );
};

export default LoginForm;