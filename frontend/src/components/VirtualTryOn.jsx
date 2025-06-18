import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';

const VirtualTryOn = ({ frame, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const draggableRef = useRef(null); // Add this ref for the Draggable component
  const [cameraActive, setCameraActive] = useState(false);
  const [frameOpacity, setFrameOpacity] = useState(0.7);
  const [frameSize, setFrameSize] = useState(100);
  
  // Component lifecycle
  useEffect(() => {
    console.log("Component mounted");
    return () => {
      console.log("Component unmounting");
      stopVideoStream();
    };
  }, []);

  // Stop video stream
  const stopVideoStream = () => {
    if (streamRef.current) {
      console.log("Stopping all tracks");
      streamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setCameraActive(false);
  };

  // Start camera with simpler approach
  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");
      stopVideoStream(); // Stop any existing stream
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      console.log("Camera access granted");
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        streamRef.current = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(() => {
              console.log("Video started playing");
              setCameraActive(true);
            })
            .catch(err => {
              console.error("Error playing video:", err);
              // Try to continue anyway
              setCameraActive(true);
            });
        };
        
        return true;
      }
      return false;
    } catch (err) {
      console.error("Camera access error:", err);
      toast.error(`Camera access denied: ${err.message}`);
      return false;
    }
  };

  const handleStartTryOn = async () => {
    console.log("Starting try-on...");
    toast.info("Starting camera, please wait...");
    
    const success = await startCamera();
    if (success) {
      console.log("Camera started successfully");
      toast.success("Adjust the frame position to try on glasses");
    } else {
      console.log("Failed to start camera");
      toast.error("Failed to start camera. Please check permissions and try again.");
    }
  };

  return (
    <div className="relative flex flex-col items-center">      
      {/* Video display with draggable frame overlay */}
      <div className="relative w-full aspect-video overflow-hidden rounded bg-gray-100">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }} /* Mirror effect */
        ></video>
        
        {cameraActive && frame.images && frame.images.length > 0 && (
          <Draggable 
            nodeRef={draggableRef} // Add this line to use the ref
            bounds="parent"
            defaultPosition={{x: 0, y: 0}} // Center position
            positionOffset={{x: '-50%', y: '-50%'}}
          >
            <div 
              ref={draggableRef} // Add this ref to the div
              className="absolute cursor-move" 
              style={{ 
                top: '50%', 
                left: '50%',
                width: `${frameSize}%`,
                zIndex: 10, // Ensure frame appears above video
              }}>
              <img 
                src={`http://localhost:5000${frame.images[0]}`} 
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
      </div>
      
      {/* Controls */}
      <div className="w-full mt-4 space-y-4">
        {!cameraActive ? (
          <button 
            onClick={handleStartTryOn} 
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Start Virtual Try-On
          </button>
        ) : (
          <>
            {/* Frame adjustment controls */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Frame Opacity: {Math.round(frameOpacity * 100)}%
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={frameOpacity * 100}
                onChange={(e) => setFrameOpacity(Number(e.target.value) / 100)}
                className="w-full"
              />
              
              <label className="block text-sm font-medium mt-4">
                Frame Size: {frameSize}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={frameSize}
                onChange={(e) => setFrameSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <button 
              onClick={stopVideoStream} 
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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