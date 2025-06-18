import React, { useEffect, useState } from 'react';
import VirtualTryOn from './VirtualTryOn';

const VirtualTryOnModal = ({ frame, onClose }) => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Set modal as ready after a brief delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Enhanced close handler with delay to ensure cleanup completes
  const handleClose = () => {
    setIsReady(false);
    
    // Short delay to ensure cleanup completes before unmounting
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden relative">
        <div className="p-4 bg-black text-white flex justify-between items-center">
          <h3 className="font-medium">Virtual Try-On: {frame.name}</h3>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <VirtualTryOn frame={frame} onClose={handleClose} />
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">How it works:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Click "Start Virtual Try-On" to activate your camera</li>
              <li>Position your face in the center of the frame</li>
              <li>Click "Capture Photo" to take a picture</li>
              <li>Our AI will automatically fit the frame to your face</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnModal;