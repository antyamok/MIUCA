import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { 
  Search,
  Paperclip,
  Image,
  Smile,
  Send
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
  };
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage?: string;
  unreadCount?: number;
  lastActive?: Date;
  role?: string;
}

interface ChatInterfaceProps {
  currentUserId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUserId }) => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sophie Laurent',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
      online: true,
      lastMessage: 'Je vous envoie les derniers plans.',
      unreadCount: 2,
      role: 'Architecte Principal'
    },
    {
      id: '2',
      name: 'Marc Dubois',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      online: false,
      lastMessage: 'Parfait, merci pour ces précisions.',
      lastActive: new Date(Date.now() - 3600000),
      role: 'Designer d\'Intérieur'
    },
    {
      id: '3',
      name: 'Elena Moretti',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      online: true,
      lastMessage: 'Le rapport est prêt pour révision.',
      role: 'Consultante Développement Durable'
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedContact) {
      // Simuler le chargement des messages
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Bonjour, comment puis-je vous aider aujourd\'hui ?',
          timestamp: new Date(Date.now() - 86400000),
          sender: selectedContact,
          type: 'text'
        },
        {
          id: '2',
          content: 'J\'aimerais discuter des dernières modifications du projet.',
          timestamp: new Date(Date.now() - 82800000),
          sender: {
            id: currentUserId,
            name: 'Vous',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            online: true
          },
          type: 'text'
        },
        {
          id: '3',
          content: 'Plans_Final_V2.pdf',
          timestamp: new Date(Date.now() - 79200000),
          sender: selectedContact,
          type: 'file',
          fileUrl: '#',
          fileName: 'Plans_Final_V2.pdf'
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedContact, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    // Réinitialiser le compteur de messages non lus
    setContacts(contacts.map(c => 
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage,
        timestamp: new Date(),
        sender: {
          id: currentUserId,
          name: 'Vous',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          online: true
        },
        type: 'text'
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = event.target.files?.[0];
    if (file && selectedContact) {
      const newMsg: Message = {
        id: Date.now().toString(),
        content: file.name,
        timestamp: new Date(),
        sender: {
          id: currentUserId,
          name: 'Vous',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
          online: true
        },
        type,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file)
      };
      setMessages([...messages, newMsg]);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  const formatLastActive = (date: Date) => {
    return format(date, "'Vu' EEEE 'à' HH:mm", { locale: fr });
  };

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
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                selectedContact?.id === contact.id ? 'bg-sage bg-opacity-5' : ''
              }`}
              onClick={() => handleContactSelect(contact)}
            >
              <div className="flex items-center mb-2">
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{contact.name}</h4>
                    {contact.unreadCount ? (
                      <span className="bg-sage text-white text-xs px-2 py-1 rounded-full">
                        {contact.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-500">{contact.role}</p>
                  {contact.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        {selectedContact ? (
          <>
            {/* En-tête du chat */}
            <div className="p-4 border-b flex items-center">
              <div className="relative">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {selectedContact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="ml-4">
                <h3 className="font-medium">{selectedContact.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedContact.online ? 'En ligne' : 'Hors ligne'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.id === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex ${message.sender.id === currentUserId ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      className="w-8 h-8 rounded-full object-cover mx-2"
                    />
                    <div>
                      {message.type === 'text' ? (
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender.id === currentUserId
                              ? 'bg-sage text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {message.content}
                        </div>
                      ) : message.type === 'file' ? (
                        <a
                          href={message.fileUrl}
                          className={`flex items-center rounded-lg p-3 ${
                            message.sender.id === currentUserId
                              ? 'bg-sage text-white rounded-br-none'
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <Paperclip className="h-5 w-5 mr-2" />
                          {message.fileName}
                        </a>
                      ) : (
                        <div className="rounded-lg overflow-hidden max-w-sm">
                          <img
                            src={message.fileUrl}
                            alt="Image partagée"
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                      <div
                        className={`text-xs text-gray-500 mt-1 ${
                          message.sender.id === currentUserId ? 'text-right' : 'text-left'
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <div className="flex-1 bg-gray-100 rounded-lg p-2">
                  <div className="flex items-end">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="w-full bg-transparent border-0 focus:ring-0 resize-none"
                        rows={1}
                        style={{ minHeight: '24px', maxHeight: '120px' }}
                      />
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="text-gray-500 hover:text-sage transition-colors duration-300"
                        >
                          <Smile className="h-5 w-5" />
                        </button>
                        {showEmojiPicker && (
                          <div className="absolute bottom-10 right-0">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-500 hover:text-sage transition-colors duration-300"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="text-gray-500 hover:text-sage transition-colors duration-300"
                      >
                        <Image className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-sage text-white p-2 rounded-lg hover:bg-opacity-90 transition-colors duration-300"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'file')}
            />
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'image')}
            />
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