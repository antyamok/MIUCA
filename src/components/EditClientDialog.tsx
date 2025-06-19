import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Eye, EyeOff, Camera, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  avatar_url?: string;
  created_at: string;
  last_seen?: string;
}

interface EditClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClientUpdated: () => void;
  client: Client | null;
}

const EditClientDialog: React.FC<EditClientDialogProps> = ({ 
  isOpen, 
  onClose, 
  onClientUpdated, 
  client 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    country: 'France',
    avatar_url: '',
    newPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        postal_code: client.postal_code || '',
        city: client.city || '',
        country: client.country || 'France',
        avatar_url: client.avatar_url || '',
        newPassword: ''
      });
      setAvatarPreview(client.avatar_url || '');
    }
  }, [client]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (!client) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Préparer les données de mise à jour
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null,
        postal_code: formData.postal_code || null,
        city: formData.city || null,
        country: formData.country,
      };

      // Gérer l'upload de l'avatar si un nouveau fichier est sélectionné
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${client.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) {
          console.error('Erreur upload avatar:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
          updateData.avatar_url = publicUrl;
        }
      }

      // Mettre à jour les informations dans la table clients
      const { error: clientError } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', client.id);

      if (clientError) {
        throw clientError;
      }

      // Mettre à jour le mot de passe si fourni via Supabase Auth
      if (formData.newPassword && formData.newPassword.trim()) {
        if (formData.newPassword.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }

        try {
          // Utiliser l'API Supabase Auth pour mettre à jour le mot de passe
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            client.id,
            { password: formData.newPassword }
          );

          if (passwordError) {
            throw new Error(passwordError.message || 'Erreur lors de la mise à jour du mot de passe');
          }
        } catch (passwordError: any) {
          // Si l'API admin n'est pas disponible, on continue sans erreur fatale
          console.warn('Impossible de mettre à jour le mot de passe:', passwordError);
          setError('Les informations ont été mises à jour, mais le mot de passe n\'a pas pu être modifié. Veuillez contacter l\'administrateur système.');
        }
      }

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        postal_code: '',
        city: '',
        country: 'France',
        avatar_url: '',
        newPassword: ''
      });
      setAvatarFile(null);
      setAvatarPreview('');

      setSuccess('Client mis à jour avec succès' + (formData.newPassword ? ' (mot de passe inclus)' : ''));

      // Notifier le parent et fermer le dialog après un délai
      setTimeout(() => {
        onClientUpdated();
        onClose();
        setSuccess('');
      }, 1500);

    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du client:', error);
      setError(error.message || 'Une erreur est survenue lors de la mise à jour du client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        postal_code: '',
        city: '',
        country: 'France',
        avatar_url: '',
        newPassword: ''
      });
      setAvatarFile(null);
      setAvatarPreview('');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!client) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-playfair">Modifier le Client</h2>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Photo de profil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo de profil
                </label>
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
                    <p className="text-sm text-gray-500">
                      JPG, PNG ou WebP. 2MB maximum.
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      placeholder="Nom du client"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      placeholder="email@exemple.com"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      placeholder="+33 1 23 45 67 89"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                      placeholder="Laisser vide pour ne pas changer"
                      minLength={6}
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 caractères. Laisser vide pour conserver le mot de passe actuel.
                  </p>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                    placeholder="123 Rue de la Paix"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                    placeholder="75000"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                    placeholder="Paris"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage disabled:bg-gray-50"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Canada">Canada</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              {/* Avertissement pour le mot de passe */}
              {formData.newPassword && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Key className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Modification du mot de passe</p>
                      <p>Le nouveau mot de passe sera appliqué immédiatement. Le client devra utiliser ce nouveau mot de passe pour se connecter.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditClientDialog;