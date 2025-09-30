"use client";

import React, { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VirtualGamepadProps {
  onControlChange: (controls: {
    forward: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
  }) => void;
}

const VirtualGamepad: React.FC<VirtualGamepadProps> = ({ onControlChange }) => {
  const isMobile = useIsMobile();
  const [activeControls, setActiveControls] = useState({
    forward: false,
    back: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  // Notify parent of control changes
  useEffect(() => {
    onControlChange(activeControls);
  }, [activeControls, onControlChange]);

  // Handle button press
  const handleButtonPress = (control: keyof typeof activeControls) => {
    setActiveControls(prev => ({ ...prev, [control]: true }));
  };

  // Handle button release
  const handleButtonRelease = (control: keyof typeof activeControls) => {
    setActiveControls(prev => ({ ...prev, [control]: false }));
  };

  // Only render on mobile devices
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-between px-4 pointer-events-none">
      {/* Left Controls (Directional Pad) */}
      <div
        className="bg-black/30 backdrop-blur-md border border-cyan-400/30 rounded-full p-4 pointer-events-auto"
        style={{ width: "160px", height: "160px" }}
      >
        <div className="relative w-full h-full">
          <button
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-lg border border-cyan-400/50 bg-black/50 flex items-center justify-center ${
              activeControls.forward ? "bg-cyan-400/30 text-cyan-300" : "text-cyan-400"
            }`}
            onTouchStart={() => handleButtonPress("forward")}
            onTouchEnd={() => handleButtonRelease("forward")}
            onMouseDown={() => handleButtonPress("forward")}
            onMouseUp={() => handleButtonRelease("forward")}
            onMouseLeave={() => handleButtonRelease("forward")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <button
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-lg border border-cyan-400/50 bg-black/50 flex items-center justify-center ${
              activeControls.back ? "bg-cyan-400/30 text-cyan-300" : "text-cyan-400"
            }`}
            onTouchStart={() => handleButtonPress("back")}
            onTouchEnd={() => handleButtonRelease("back")}
            onMouseDown={() => handleButtonPress("back")}
            onMouseUp={() => handleButtonRelease("back")}
            onMouseLeave={() => handleButtonRelease("back")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-lg border border-cyan-400/50 bg-black/50 flex items-center justify-center ${
              activeControls.left ? "bg-cyan-400/30 text-cyan-300" : "text-cyan-400"
            }`}
            onTouchStart={() => handleButtonPress("left")}
            onTouchEnd={() => handleButtonRelease("left")}
            onMouseDown={() => handleButtonPress("left")}
            onMouseUp={() => handleButtonRelease("left")}
            onMouseLeave={() => handleButtonRelease("left")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-lg border border-cyan-400/50 bg-black/50 flex items-center justify-center ${
              activeControls.right ? "bg-cyan-400/30 text-cyan-300" : "text-cyan-400"
            }`}
            onTouchStart={() => handleButtonPress("right")}
            onTouchEnd={() => handleButtonRelease("right")}
            onMouseDown={() => handleButtonPress("right")}
            onMouseUp={() => handleButtonRelease("right")}
            onMouseLeave={() => handleButtonRelease("right")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full border border-cyan-400/30 bg-black/30"></div>
          </div>
        </div>
      </div>
      
      {/* Right Controls (Action buttons) */}
      <div className="bg-black/30 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 pointer-events-auto flex flex-col justify-center">
        <div className="flex flex-col space-y-4">
          <button
            className={`w-14 h-14 rounded-full border border-purple-500/50 bg-black/50 flex items-center justify-center ${
              activeControls.up ? "bg-purple-500/30 text-purple-300" : "text-purple-400"
            }`}
            onTouchStart={() => handleButtonPress("up")}
            onTouchEnd={() => handleButtonRelease("up")}
            onMouseDown={() => handleButtonPress("up")}
            onMouseUp={() => handleButtonRelease("up")}
            onMouseLeave={() => handleButtonRelease("up")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
          
          <button
            className={`w-14 h-14 rounded-full border border-pink-500/50 bg-black/50 flex items-center justify-center ${
              activeControls.down ? "bg-pink-500/30 text-pink-300" : "text-pink-400"
            }`}
            onTouchStart={() => handleButtonPress("down")}
            onTouchEnd={() => handleButtonRelease("down")}
            onMouseDown={() => handleButtonPress("down")}
            onMouseUp={() => handleButtonRelease("down")}
            onMouseLeave={() => handleButtonRelease("down")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualGamepad;