import React from 'react';

const Loading = ({ fullScreen = true, message = 'Loading...' }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-10 h-10">
                <div className="absolute top-0 left-0 w-full h-full border-3 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-3 border-black rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );
};

export default Loading;
