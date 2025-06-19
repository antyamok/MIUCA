import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Archive, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface ArchiveClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClientArchived: () => void;
  client: Client | null;
}

const ArchiveClientDialog: React.FC<ArchiveClientDialogProps> = ({ 
  isOpen, 
  onClose, 
  onClientArchived, 
  client 
}) => {
  const [archiveReason, setArchiveReason] = useState<'won' | 'lost'>('won');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Archiver le client dans la base de données
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          archived: true,
          archive_reason: archiveReason,
          archived_at: new Date().toISOString(),
          password_expired: true
        })
        .eq('id', client.id);

      if (updateError) {
        throw updateError;
      }

      // Désactiver l'utilisateur dans Supabase Auth via l'API backend
      try {
        const response = await fetch('/api/admin/disable-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: client.id,
            reason: `Client archivé - ${archiveReason === 'won' ? 'Gagné' : 'Perdu'}`
          })
        });

        const result = await response.json();

        if (!response.ok) {
          console.error('Erreur lors de la désactivation du compte:', result.error);
          // Ne pas bloquer le processus si seule la désactivation échoue
        }
      } catch (authError) {
        console.error('Erreur auth:', authError);
        // Continuer même si l'auth échoue
      }

      // Notifier le parent et fermer le dialog
      onClientArchived();
      onClose();
      setArchiveReason('won');

    } catch (error: any) {
      console.error('Erreur lors de l\'archivage du client:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'archivage du client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setArchiveReason('won');
      setError('');
      onClose();
    }
  };

  if (!client) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <Archive className="h-6 w-6 text-orange-500 mr-3" />
                <h2 className="text-xl font-playfair">Archiver le Client</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenu */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Avertissement */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Attention !</p>
                    <p>Cette action va :</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Déplacer <strong>{client.name}</strong> vers les clients archivés</li>
                      <li>Expirer son mot de passe</li>
                      <li>L'empêcher de se connecter à son espace client</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Raison de l'archivage */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Raison de l'archivage
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="archiveReason"
                      value="won"
                      checked={archiveReason === 'won'}
                      onChange={(e) => setArchiveReason(e.target.value as 'won' | 'lost')}
                      className="mr-3 text-sage focus:ring-sage"
                      disabled={isLoading}
                    />
                    <span className="text-sm">
                      <strong className="text-green-600">Client gagné</strong> - Projet terminé avec succès
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="archiveReason"
                      value="lost"
                      checked={archiveReason === 'lost'}
                      onChange={(e) => setArchiveReason(e.target.value as 'won' | 'lost')}
                      className="mr-3 text-sage focus:ring-sage"
                      disabled={isLoading}
                    />
                    <span className="text-sm">
                      <strong className="text-red-600">Client perdu</strong> - Projet annulé ou non abouti
                    </span>
                  </label>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex space-x-3">
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
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Archivage...' : 'Archiver'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ArchiveClientDialog;