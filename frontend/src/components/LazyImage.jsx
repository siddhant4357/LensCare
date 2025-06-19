import { useState } from 'react';

const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className={`relative ${className} overflow-hidden`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;