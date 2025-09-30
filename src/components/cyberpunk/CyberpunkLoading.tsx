"use client";

import React from "react";

interface CyberpunkLoadingProps {
  progress: number;
}

const CyberpunkLoading: React.FC<CyberpunkLoadingProps> = ({ progress }) => {
  return (
    <div className="cyberpunk-body fixed inset-0 z-50 flex items-center justify-center">
      {/* Background elements */}
      <div className="neon-light"></div>
      <div className="neon-light"></div>
      <div className="energy-line"></div>
      <div className="energy-line"></div>
      
      <div className="cyberpunk-container flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <h1 className="cyberpunk-main-title text-4xl md:text-6xl">
            LOADING
          </h1>
          <p className="cyberpunk-subtitle mt-4 text-lg">
            Initializing cybernetic systems...
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md">
          <div className="cyberpunk-control-slider mb-2 h-6 rounded-md">
            <div 
              className="slider-track h-full rounded-md bg-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
            <div 
              className="slider-handle absolute top-1/2 h-4 w-4 rounded-full bg-white shadow-lg transition-all duration-300 ease-out"
              style={{ 
                left: `calc(${progress}% - 8px)`,
                boxShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
              }}
            ></div>
          </div>
          <div className="text-center text-cyan-400 mt-2">
            {progress.toFixed(1)}%
          </div>
        </div>
        
        {/* Loading spinner */}
        <div className="mt-8 relative">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
    </div>
  );
};

export default CyberpunkLoading;