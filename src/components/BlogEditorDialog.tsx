import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface BlogEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    status: 'draft' | 'published';
  };
}

const BlogEditorDialog: React.FC<BlogEditorDialogProps> = ({ isOpen, onClose, post }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: 'design-durable',
    status: 'draft' as 'draft' | 'published'
  });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category.toLowerCase().replace(' ', '-'),
        status: post.status
      });
      setImagePreview(post.image);
    } else {
      resetForm();
    }
  }, [post]);

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      category: 'design-durable',
      status: 'draft'
    });
    setImagePreview('');
    setError('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'image est trop volumineuse. Taille maximale : 2MB');
        return;
      }
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Format d\'image non supporté. Utilisez JPG, PNG ou WebP');
        return;
      }
      
      // Créer une URL pour la prévisualisation
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ ...prev, image: previewUrl }));
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Le titre est requis');
      return;
    }
    if (!formData.excerpt.trim()) {
      setError('Le résumé est requis');
      return;
    }
    if (!formData.content.trim()) {
      setError('Le contenu est requis');
      return;
    }
    if (!formData.image) {
      setError('Une image est requise');
      return;
    }

    // Ici, vous pouvez ajouter la logique pour sauvegarder l'article
    console.log('Article à sauvegarder:', formData);
    
    // Réinitialiser et fermer
    resetForm();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-6"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {post ? 'Modifier l\'article' : 'Nouvel article'}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image de couverture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image de couverture
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="cover-image"
                        />
                        <label
                          htmlFor="cover-image"
                          className="btn-secondary inline-block cursor-pointer"
                        >
                          Choisir une image
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG ou WebP. 2MB maximum.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                      placeholder="Entrez le titre de l'article"
                    />
                  </div>

                  {/* Résumé */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Résumé
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                      placeholder="Entrez un bref résumé de l'article"
                    />
                  </div>

                  {/* Contenu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenu
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={10}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                      placeholder="Rédigez votre article ici..."
                    />
                  </div>

                  {/* Catégorie et Statut */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                      >
                        <option value="design-durable">Design Durable</option>
                        <option value="materiaux-ecologiques">Matériaux Écologiques</option>
                        <option value="vie-ecologique">Vie Écologique</option>
                        <option value="tendances">Tendances Architecture</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                      >
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                      </select>
                    </div>
                  </div>

                  {/* Message d'erreur */}
                  {error && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {error}
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      onClick={onClose}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-sage rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-opacity-75"
                    >
                      {post ? 'Mettre à jour' : 'Publier'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BlogEditorDialog;