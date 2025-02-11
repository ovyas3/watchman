import axios from 'axios';
import { truncate } from 'fs/promises';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  imagePayload: any;
  setPopupOpen:any;
}

const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, imagePayload,setPopupOpen }) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);
  const [fadeOut, setFadeOut] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const videoConstraints = {
    facingMode: FACING_MODE_USER
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setPopupMessage(null); 
  };

  const submit = async () => {
    const formData = new FormData();
    // formData.append('imageUrl', capturedImage || '');
    formData.append('imageUrl', dataURItoBlob(capturedImage || '') || '', 'image.jpg');
    formData.append('checkList_Id', imagePayload?.checkListId);
    formData.append('imgType', imagePayload?.type);
    formData.append('prompt', imagePayload?.prompt);
    formData.append('stageName', imagePayload?.stageName);


    const config = {
      url: 'https://prod-api.instavans.com/api/thor/v1/security/vertifyImage',
      method: 'POST',
      headers: {
        'Authorization': `bearer ${localStorage?.getItem('accessToken')} Shipper ${localStorage?.getItem('default_unit')}`,
      },
      data: formData,
    };

    try {
      const response :any = await axios(config);
      if (response.status === 200) {
        setPopupOpen({msg:'Image submitted successfully',type:true});
        onCapture(response.data.data || '');
      }else{
        setPopupOpen({msg:response?.message,type:true});
        onClose();
      }
      onClose();
    }
    catch (error:any) {
      console.log(error.response?.data?.message);
      setPopupOpen({msg:error.response?.data?.message,type:true});
      onClose();
      // console.log(error);
    }

    // if (capturedImage) {
    //   onCapture(capturedImage);
    //   onClose();
    // }
  };

  const handleClosePopup = () => {
    setFadeOut(true); // Trigger fade-out animation
    setTimeout(() => {
      setPopupMessage(null); // Remove popup after animation
      setFadeOut(false); // Reset fade-out state
    }, 1000);
  };

  
    const handleClick = React.useCallback(() => {
      setFacingMode(
        prevState =>
          prevState === FACING_MODE_USER
            ? FACING_MODE_ENVIRONMENT
            : FACING_MODE_USER
      );
    }, []);

  return (
    <div className="camera-capture w-full">
      {popupMessage && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ${
            fadeOut ? "opacity-0" : "opacity-100"
          } transition-opacity duration-1000`} // Smooth fade-out
          style={{ backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-bold mb-2">
              {popupMessage.includes('successfully') ? 'Success!' : 'Error'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{popupMessage}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {!capturedImage ? (
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            height="auto"
            videoConstraints={{
              ...videoConstraints,
              facingMode
            }}
          />
          <div style={{display: "flex", justifyContent: "space-between"}}>
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>Switch camera</button>
         
         <button 
           className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
           onClick={capture}
         >
           Capture photo
         </button>
          </div>
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
