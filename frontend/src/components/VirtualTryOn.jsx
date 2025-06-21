import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';
import { useCamera } from '../context/CameraContext';
import { getImageUrl } from '../utils/imageUrl';

const VirtualTryOn = ({ frame }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const draggableRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [frameOpacity, setFrameOpacity] = useState(0.9);
  const [frameSize, setFrameSize] = useState(100);
  const [isInitialized, setIsInitialized] = useState(false);
  const { requestCameraAccess } = useCamera();
  
  // Component lifecycle
  useEffect(() => {
    setIsInitialized(true);
    return () => {
      stopVideoStream();
    };
  }, []);

  // Stop video stream
  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setCameraActive(false);
  };

  // Start camera
  const startCamera = async () => {
    if (!isInitialized) {
      return false;
    }

    return new Promise(async (resolve) => {
      try {
        stopVideoStream();
        
        const mediaStream = await requestCameraAccess();
        
        if (!mediaStream) {
          resolve(false);
          return;
        }
        
        if (!videoRef.current) {
          setTimeout(async () => {
            if (videoRef.current) {
              try {
                videoRef.current.srcObject = mediaStream;
                streamRef.current = mediaStream;
                await setupVideoPlayback(mediaStream);
                resolve(true);
              } catch (err) {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          }, 100);
        } else {
          videoRef.current.srcObject = mediaStream;
          streamRef.current = mediaStream;
          const success = await setupVideoPlayback(mediaStream);
          resolve(success);
        }
      } catch (err) {
        toast.error(`Camera access denied: ${err.message}`);
        resolve(false);
      }
    });
  };

  // Helper function to setup video playback
  const setupVideoPlayback = (mediaStream) => {
    return new Promise((resolve) => {
      if (!videoRef.current) {
        resolve(false);
        return;
      }

      const handleCanPlay = () => {
        videoRef.current.play()
          .then(() => {
            setCameraActive(true);
            videoRef.current.removeEventListener('canplay', handleCanPlay);
            resolve(true);
          })
          .catch(err => {
            videoRef.current.removeEventListener('canplay', handleCanPlay);
            resolve(false);
          });
      };

      videoRef.current.addEventListener('canplay', handleCanPlay);

      setTimeout(() => {
        if (!cameraActive) {
          videoRef.current?.removeEventListener('canplay', handleCanPlay);
          resolve(false);
        }
      }, 5000);
    });
  };

  const handleStartTryOn = async () => {
    toast.info("Starting camera, please wait...");
    
    const success = await startCamera();
    if (success) {
      toast.success("Drag the frame to adjust position");
    } else {
      toast.error("Failed to start camera. Please check permissions and try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-md">
      {/* Larger camera view with higher aspect ratio for mobile */}
      <div className="relative w-full aspect-[16/12] sm:aspect-[4/3] lg:aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden shadow-inner">
        <video 
          ref={videoRef} 
          className={`w-full h-full object-cover ${!cameraActive ? 'hidden' : ''}`}
          autoPlay 
          playsInline
          muted
        />
        
        {cameraActive && frame.images && frame.images.length > 0 && (
          <Draggable 
            nodeRef={draggableRef}
            bounds="parent"
            defaultPosition={{x: 0, y: 0}}
            positionOffset={{x: '-50%', y: '-50%'}}
          >
            <div 
              ref={draggableRef}
              className="absolute cursor-move" 
              style={{ 
                top: '50%', 
                left: '50%',
                width: `${frameSize}%`,
                zIndex: 10,
              }}>
              <img 
                src={getImageUrl(frame.images[0])}
                alt={frame.name}
                style={{ 
                  opacity: frameOpacity,
                  width: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </Draggable>
        )}
        
        {!cameraActive && (
          <div className="flex flex-col items-center justify-center h-full absolute inset-0">
            <div className="text-6xl mb-3">👓</div>
            <p className="text-gray-500 text-sm">Camera preview will appear here</p>
          </div>
        )}
      </div>

      {/* Controls section - more touch friendly */}
      <div className="w-full p-3 sm:p-4 space-y-3">
        {!cameraActive ? (
          <button 
            onClick={handleStartTryOn} 
            className="w-full py-3 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all duration-300 shadow-sm"
          >
            Start Try-On
          </button>
        ) : (
          <>
            {/* Mobile-first controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 bg-gray-50 p-3 rounded-xl">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700">Opacity</label>
                  <span className="text-sm text-black font-medium">{Math.round(frameOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={frameOpacity * 100}
                  onChange={(e) => setFrameOpacity(Number(e.target.value) / 100)}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                />
              </div>
              
              <div className="space-y-1 bg-gray-50 p-3 rounded-xl">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-700">Size</label>
                  <span className="text-sm text-black font-medium">{frameSize}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={frameSize}
                  onChange={(e) => setFrameSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Instruction for mobile only */}
            <p className="text-xs text-center text-gray-500 md:hidden">Drag the frame to position it properly</p>
            
            <button 
              onClick={stopVideoStream} 
              className="w-full py-2.5 bg-red-600 text-white rounded-full font-bold text-base hover:bg-red-700 transition-all duration-300 shadow-sm"
            >
              Stop Try-On
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VirtualTryOn;