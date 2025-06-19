// src/components/AdminClientInterface.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  User,
  Mail,
  Phone,
  Circle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import AddClientDialog from './AddClientDialog';
import EditClientDialog from './EditClientDialog';

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
  is_online?: boolean;
  archived: boolean;
}

const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

const AdminClientInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

  // 1) Charger les clients actifs avec last_seen → is_online
  const loadClients = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('id,name,email,phone,address,postal_code,city,country,avatar_url,created_at,last_seen,archived')
      .eq('archived', false)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Erreur chargement clients:', error);
      setClients([]);
    } else {
      const now = Date.now();
      setClients(
        (data || []).map((c) => ({
          ...c,
          is_online:
            c.last_seen != null && now - new Date(c.last_seen).getTime() < ONLINE_THRESHOLD,
        }))
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  // 2) Filtrer par recherche
  const filteredClients = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.phone?.includes(term) ?? false) ||
      (c.city?.toLowerCase().includes(term) ?? false) ||
      (c.postal_code?.includes(term) ?? false)
    );
  });

  // 3) Soft-delete (désactiver) un client
  const handleDisable = async (client: Client) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir désactiver ${client.name} (${client.email}) ?`
      )
    ) {
      const { error } = await supabase
        .from('clients')
        .update({ archived: true })
        .eq('id', client.id);
      if (error) {
        console.error('Erreur désactivation client:', error);
        alert('Impossible de désactiver ce client');
      } else {
        loadClients();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Recherche & actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex-1">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Rechercher un client…"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un client
        </button>
      </div>

      {/* Liste */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-sage"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <motion.div
                key={client.id}
                className="border rounded-lg p-4 hover:border-sage transition-colors duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-sage bg-opacity-10 rounded-full flex items-center justify-center overflow-hidden">
                        {client.avatar_url ? (
                          <img
                            src={client.avatar_url}
                            alt="Avatar"
                            className="h-12 w-12 object-cover rounded-full"
                          />
                        ) : (
                          <User className="h-6 w-6 text-sage" />
                        )}
                      </div>
                      {/* Badge en ligne */}
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          client.is_online ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        title={client.is_online ? 'En ligne' : 'Hors ligne'}
                      />
                    </div>

                    {/* Informations */}
                    <div>
                      <h3 className="font-medium text-lg flex items-center space-x-2">
                        <span>{client.name}</span>
                        {client.is_online && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            En ligne
                          </span>
                        )}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center space-x-4 mt-1">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {client.email}
                        </span>
                        {client.phone && (
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {client.phone}
                          </span>
                        )}
                      </div>
                      {/* Affichage de l'adresse complète */}
                      {(client.address || client.city || client.postal_code) && (
                        <div className="text-xs text-gray-400 mt-1">
                          {[
                            client.address,
                            client.postal_code && client.city ? `${client.postal_code} ${client.city}` : client.city || client.postal_code,
                            client.country !== 'France' ? client.country : null
                          ].filter(Boolean).join(', ')}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Inscrit le{' '}
                        {new Date(client.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditClient(client)}
                      title="Modifier"
                      className="p-2 text-sage hover:text-terracotta transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDisable(client)}
                      title="Désactiver"
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <User className="h-16 w-16 mx-auto mb-4" />
              <p>Aucun client actif trouvé.</p>
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AddClientDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onClientAdded={loadClients}
      />
      {editClient && (
        <EditClientDialog
          isOpen={true}
          client={editClient}
          onClose={() => setEditClient(null)}
          onClientUpdated={loadClients}
        />
      )}
    </div>
  );
};

export default AdminClientInterface;