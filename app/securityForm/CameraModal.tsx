import React from 'react';
import CameraCapture from './CameraCapture';
import CloseIcon from '@mui/icons-material/Close';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOutsideClick}>
      <div className="bg-white p-4 rounded-lg w-full max-w-md relative">
        <button 
          className="flex w-full justify-end align-center text-gray-600 hover:text-gray-800" 
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <CameraCapture onCapture={onCapture} onClose={onClose} />
      </div>
    </div>
  );
};

export default CameraModal;