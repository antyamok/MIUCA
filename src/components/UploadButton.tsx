import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import UploadDocumentDialog from './UploadDocumentDialog';

const UploadButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button 
        className="btn-primary flex items-center"
        onClick={() => setIsDialogOpen(true)}
      >
        <Upload className="h-4 w-4 mr-2" />
        Téléverser un document
      </button>

      <UploadDocumentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default UploadButton;