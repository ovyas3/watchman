import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const submit = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  return (
    <div className="camera-capture w-full">
      {!capturedImage ? (
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="auto"
          />
          <button 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={capture}
          >
            Capture photo
          </button>
        </div>
      ) : (
        <div className="captured-image-container">
          <img src={capturedImage} alt="captured" className="w-full" />
          <div className="mt-4 flex justify-between">
            <button 
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={retake}
            >
              Take Again
            </button>
            <button 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={submit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
