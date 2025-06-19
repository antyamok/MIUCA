import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Send,
  User,
  Circle,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image,
  Smile
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string;
  client_id?: string;
  project_id?: string;
  content: string;
  message_type: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    name?: string;
    email: string;
  };
}

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  last_seen?: string;
  is_online?: boolean;
  role?: string;
  unread_count?: number;
}

interface ChatInterfaceProps {
  currentUserId: string;
}

const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUserId }) => {
  const { user, isAdmin } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Fonction pour enrichir les messages avec les informations du sender
  const enrichMessagesWithSenderInfo = (messages: any[], contacts: Contact[]) => {
    return messages.map(message => {
      const sender = contacts.find(contact => contact.id === message.sender_id);
      return {
        ...message,
        sender: sender ? {
          name: sender.name,
          email: sender.email
        } : {
          name: 'Utilisateur inconnu',
          email: ''
        }
      };
    });
  };

  // Charger les contacts
  const loadContacts = async () => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        // Les admins voient tous les clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, name, email, avatar_url, last_seen, archived')
          .eq('archived', false)
          .order('name');

        if (clientsError) throw clientsError;

        // Calculer le statut en ligne et compter les messages non lus
        const contactsWithStatus = await Promise.all(
          (clientsData || []).map(async (client) => {
            const isOnline = client.last_seen ? 
              (Date.now() - new Date(client.last_seen).getTime()) < ONLINE_THRESHOLD : false;

            // Compter les messages non lus de ce client
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('sender_id', client.id)
              .eq('is_read', false);

            return {
              ...client,
              is_online: isOnline,
              role: 'Client',
              unread_count: count || 0
            };
          })
        );

        setContacts(contactsWithStatus);
      } else {
        // Les clients voient tous les admins
        const { data: adminsData, error: adminsError } = await supabase
          .from('admins')
          .select('id, name, email, last_login')
          .order('name');

        if (adminsError) throw adminsError;

        const contactsWithStatus = await Promise.all(
          (adminsData || []).map(async (admin) => {
            const isOnline = admin.last_login ? 
              (Date.now() - new Date(admin.last_login).getTime()) < ONLINE_THRESHOLD : false;

            // Compter les messages non lus de cet admin
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('sender_id', admin.id)
              .eq('is_read', false);

            return {
              id: admin.id,
              name: admin.name || admin.email.split('@')[0],
              email: admin.email,
              is_online: isOnline,
              role: 'Équipe MIUCA',
              unread_count: count || 0
            };
          })
        );

        setContacts(contactsWithStatus);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les messages avec un contact
  const loadMessages = async (contactId: string) => {
    if (!contactId) return;

    setIsLoadingMessages(true);
    try {
      // Récupérer les messages sans jointure
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Enrichir les messages avec les informations du sender
      const enrichedMessages = enrichMessagesWithSenderInfo(data || [], contacts);
      setMessages(enrichedMessages);

      // Marquer les messages comme lus
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', contactId)
        .eq('recipient_id', currentUserId)
        .eq('is_read', false);

      // Mettre à jour le compteur de messages non lus
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, unread_count: 0 }
          : contact
      ));

    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const messageData = {
        sender_id: currentUserId,
        recipient_id: selectedContact.id,
        client_id: isAdmin ? selectedContact.id : currentUserId,
        content: newMessage.trim(),
        message_type: 'text',
        is_read: false
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      // Ajouter le message à la liste locale avec les informations du sender
      const enrichedMessage = {
        ...data,
        sender: {
          name: user?.name || 'Vous',
          email: user?.email || ''
        }
      };

      setMessages(prev => [...prev, enrichedMessage]);
      setNewMessage('');
      
      // Faire défiler vers le bas
      setTimeout(() => scrollToBottom(), 100);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  // Faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Gérer la sélection d'un contact
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    loadMessages(contact.id);
  };

  // Gérer l'envoi avec Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Filtrer les contacts
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formater l'heure
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater la date relative
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  useEffect(() => {
    loadContacts();
  }, [currentUserId, isAdmin]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscription en temps réel pour les nouveaux messages
  useEffect(() => {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `recipient_id=eq.${currentUserId}`
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Si le message vient du contact sélectionné, l'ajouter à la conversation
          if (selectedContact && newMessage.sender_id === selectedContact.id) {
            // Enrichir le nouveau message avec les informations du sender
            const enrichedMessage = {
              ...newMessage,
              sender: {
                name: selectedContact.name,
                email: selectedContact.email
              }
            };
            
            setMessages(prev => [...prev, enrichedMessage]);
            
            // Marquer comme lu immédiatement
            supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMessage.id);
          } else {
            // Sinon, mettre à jour le compteur de messages non lus
            setContacts(prev => prev.map(contact => 
              contact.id === newMessage.sender_id 
                ? { ...contact, unread_count: (contact.unread_count || 0) + 1 }
                : contact
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId, selectedContact]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
      {/* Liste des contacts */}
      <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sage"></div>
            </div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-b ${
                  selectedContact?.id === contact.id ? 'bg-sage bg-opacity-5 border-sage' : ''
                }`}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    {contact.avatar_url ? (
                      <img
                        src={contact.avatar_url}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-sage bg-opacity-10 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-sage" />
                      </div>
                    )}
                    {contact.is_online && (
                      <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-current" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-gray-500">{contact.role}</p>
                      </div>
                      {contact.unread_count && contact.unread_count > 0 && (
                        <span className="bg-sage text-white text-xs px-2 py-1 rounded-full">
                          {contact.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {contact.is_online ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Aucun contact trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        {selectedContact ? (
          <>
            {/* En-tête du chat */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  {selectedContact.avatar_url ? (
                    <img
                      src={selectedContact.avatar_url}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-sage bg-opacity-10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-sage" />
                    </div>
                  )}
                  {selectedContact.is_online && (
                    <Circle className="absolute bottom-0 right-0 w-3 h-3 text-green-500 fill-current" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedContact.is_online ? 'En ligne' : 'Hors ligne'} • {selectedContact.role}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-sage transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-sage transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-sage transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sage"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((message, index) => {
                  const isOwnMessage = message.sender_id === currentUserId;
                  const showDate = index === 0 || 
                    formatRelativeDate(message.created_at) !== formatRelativeDate(messages[index - 1].created_at);

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="text-center text-xs text-gray-500 my-4">
                          {formatRelativeDate(message.created_at)}
                        </div>
                      )}
                      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`rounded-lg p-3 ${
                              isOwnMessage
                                ? 'bg-sage text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          <div
                            className={`text-xs text-gray-500 mt-1 ${
                              isOwnMessage ? 'text-right' : 'text-left'
                            }`}
                          >
                            {formatTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucun message. Commencez la conversation !</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <div className="flex-1 bg-gray-100 rounded-lg p-2">
                  <div className="flex items-end">
                    <textarea
                      ref={messageInputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Écrivez votre message..."
                      className="w-full bg-transparent border-0 focus:ring-0 resize-none"
                      rows={1}
                      style={{ minHeight: '24px', maxHeight: '120px' }}
                    />
                    <div className="flex items-center space-x-2 ml-2">
                      <button className="text-gray-500 hover:text-sage transition-colors">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-sage transition-colors">
                        <Image className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-sage transition-colors">
                        <Smile className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-sage text-white p-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-500">
                Choisissez un contact pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;