import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Lock, Camera, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SettingsInterfaceProps {
  user: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

const SettingsInterface: React.FC<SettingsInterfaceProps> = ({ user }) => {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'identity' | 'address' | 'security'>('identity');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [formData, setFormData] = useState({
    // Identité
    name: '',
    email: '',
    phone: '',
    avatar_url: '',
    // Adresse
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    // Sécurité
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Charger les données du client depuis Supabase
  useEffect(() => {
    const loadClientData = async () => {
      if (!authUser?.id) return;

      try {
        const { data, error } = await supabase
          .from('clients')
          .select('name, email, phone, address, city, postal_code, country, avatar_url')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error('Erreur lors du chargement des données:', error);
          return;
        }

        if (data) {
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            postal_code: data.postal_code || '',
            country: data.country || 'France',
            avatar_url: data.avatar_url || ''
          }));
          setAvatarPreview(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    loadClientData();
  }, [authUser?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'image est trop volumineuse. Taille maximale : 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Format d\'image non supporté. Utilisez JPG, PNG ou WebP');
        return;
      }
      
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.id) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Préparer les données de mise à jour selon l'onglet actif
      let updateData: any = {};

      if (activeTab === 'identity') {
        updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null
        };

        // Gérer l'upload de l'avatar si un nouveau fichier est sélectionné
        if (avatarFile) {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${authUser.id}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, { upsert: true });

          if (uploadError) {
            console.error('Erreur upload avatar:', uploadError);
            setError('Erreur lors du téléchargement de l\'avatar');
            return;
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            updateData.avatar_url = publicUrl;
          }
        }
      } else if (activeTab === 'address') {
        updateData = {
          address: formData.address || null,
          city: formData.city || null,
          postal_code: formData.postal_code || null,
          country: formData.country
        };
      } else if (activeTab === 'security') {
        // Vérifier que les mots de passe correspondent
        if (formData.newPassword !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }

        if (formData.newPassword && formData.newPassword.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }

        // Mettre à jour le mot de passe via Supabase Auth
        if (formData.newPassword) {
          const { error: passwordError } = await supabase.auth.updateUser({
            password: formData.newPassword
          });

          if (passwordError) {
            setError('Erreur lors de la mise à jour du mot de passe: ' + passwordError.message);
            return;
          }

          // Réinitialiser les champs de mot de passe
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        }
      }

      // Mettre à jour les informations dans la table clients (sauf pour l'onglet sécurité qui ne concerne que le mot de passe)
      if (activeTab !== 'security' || Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('clients')
          .update(updateData)
          .eq('id', authUser.id);

        if (updateError) {
          setError('Erreur lors de la mise à jour: ' + updateError.message);
          return;
        }
      }

      setSuccess('Informations mises à jour avec succès');
      setAvatarFile(null);

    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Une erreur est survenue lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-playfair">Paramètres du compte</h2>
      </div>

      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-6">
          {success}
        </div>
      )}

      {/* Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'identity'
              ? 'text-sage border-b-2 border-sage'
              : 'text-gray-500 hover:text-sage'
          }`}
          onClick={() => setActiveTab('identity')}
        >
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Identité
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'address'
              ? 'text-sage border-b-2 border-sage'
              : 'text-gray-500 hover:text-sage'
          }`}
          onClick={() => setActiveTab('address')}
        >
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Adresse
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'security'
              ? 'text-sage border-b-2 border-sage'
              : 'text-gray-500 hover:text-sage'
          }`}
          onClick={() => setActiveTab('security')}
        >
          <div className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Sécurité
          </div>
        </button>
      </div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          {activeTab === 'identity' && (
            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-sage text-white p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition-colors duration-300"
                  >
                    <Camera className="h-4 w-4" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <h3 className="font-medium">Photo de profil</h3>
                  <p className="text-sm text-gray-500">
                    JPG, PNG ou WebP. 2MB maximum.
                  </p>
                </div>
              </div>

              {/* Champs d'identité */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rue
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="max-w-md">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                  />
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Lock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Votre mot de passe doit contenir au moins 6 caractères.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-sage text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SettingsInterface;