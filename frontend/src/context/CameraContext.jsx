import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CameraContext = createContext();

export const useCamera = () => useContext(CameraContext);

export const CameraProvider = ({ children }) => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  
  const requestCameraAccess = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: false 
      });
      
      setPermission(true);
      setStream(cameraStream);
      setError(null);
      return cameraStream;
    } catch (err) {
      setError(err.message);
      toast.error("Camera access is required for virtual try-on");
      console.error("Error accessing camera:", err);
      return null;
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        console.log("Cleaning up camera context on unmount");
        stream.getTracks().forEach(track => {
          track.stop();
          console.log("Context camera track stopped:", track.kind);
        });
      }
    };
  }, [stream]);
  
  return (
    <CameraContext.Provider value={{ 
      permission, 
      stream, 
      error, 
      requestCameraAccess, 
      stopCamera 
    }}>
      {children}
    </CameraContext.Provider>
  );
};