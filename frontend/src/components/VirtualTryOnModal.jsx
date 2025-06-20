import React from 'react';
import VirtualTryOn from './VirtualTryOn';

const VirtualTryOnModal = ({ frame, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-auto animate-fade-in-up shadow-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Try-on Area - Made larger */}
          <div className="md:w-4/5 p-4 md:p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Virtual Try-On</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all duration-300"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <VirtualTryOn frame={frame} />
          </div>
          
          {/* Instructions Panel - Made smaller and hidden on small screens */}
          <div className="hidden md:block bg-gradient-to-br from-gray-50 to-white md:w-1/5 p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-100">
            <h3 className="font-bold text-lg mb-3">How It Works</h3>
            
            <div className="border-l-4 border-black pl-3 py-2 mb-3">
              <p className="text-gray-800 font-medium text-sm">
                Try <span className="font-bold">{frame.name}</span> frames
              </p>
            </div>
            
            <ol className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start">
                <span className="bg-black text-white h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">1</span>
                <span>Start Try-On</span>
              </li>
              <li className="flex items-start">
                <span className="bg-black text-white h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">2</span>
                <span>Adjust size/opacity</span>
              </li>
              <li className="flex items-start">
                <span className="bg-black text-white h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-xs">3</span>
                <span>Drag to position</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOnModal;