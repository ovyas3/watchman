import React from 'react';
import CameraCapture from './CameraCapture';
import CloseIcon from '@mui/icons-material/Close';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string) => void;
  part: any;
  selectedItem: any
  activeStage: any;
  setPopupOpen:any
}



const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture, part, selectedItem, activeStage,setPopupOpen }) => {
  if (!isOpen) return null;


  const imagePayload = {
    checkListId: selectedItem?._id,
    type: part?.imgType,
    prompt: part?.prompt,
    stageName: activeStage?.activeStage?.name
  }

  // console.log("🚀 ~ file: CameraModal.tsx:15 ~ CameraModal ~ imagePayload:", imagePayload)


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
        <CameraCapture onCapture={onCapture} onClose={onClose} imagePayload={imagePayload} setPopupOpen={setPopupOpen} />
      </div>
    </div>
  );
};

export default CameraModal;