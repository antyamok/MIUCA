import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale : 10MB');
        return;
      }
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non supporté. Formats acceptés : PDF, JPEG, PNG, DOC, DOCX');
        return;
      }
      setError('');
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }
    if (!projectName) {
      setError('Veuillez sélectionner un projet');
      return;
    }
    // Ici, vous pouvez ajouter la logique pour envoyer le fichier au serveur
    console.log('Envoi du fichier :', {
      file: selectedFile,
      projectName,
      description
    });
    // Réinitialiser le formulaire
    setSelectedFile(null);
    setProjectName('');
    setDescription('');
    setError('');
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-6"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Téléverser un document
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Zone de dépôt de fichier */}
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sage transition-colors duration-300"
                    >
                      {selectedFile ? (
                        <div className="flex items-center text-sage">
                          <FileText className="h-8 w-8 mr-2" />
                          <span>{selectedFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-600">
                          <Upload className="h-8 w-8 mb-2 text-gray-400" />
                          <span>Cliquez ou déposez un fichier ici</span>
                          <span className="text-sm text-gray-500">PDF, JPEG, PNG, DOC jusqu'à 10MB</span>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Sélection du projet */}
                  <div>
                    <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                      Projet associé
                    </label>
                    <select
                      id="project"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                    >
                      <option value="">Sélectionnez un projet</option>
                      <option value="eco-harmony">Eco Harmony Villa</option>
                      <option value="urban-loft">Urban Loft Renovation</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optionnelle)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-sage"
                      placeholder="Ajoutez une description du document..."
                    />
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
                      Téléverser
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

export default UploadDocumentDialog;