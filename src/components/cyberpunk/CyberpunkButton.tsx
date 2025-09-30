"use client";

import React from "react";

interface CyberpunkButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const CyberpunkButton: React.FC<CyberpunkButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`cyberpunk-action-btn ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default CyberpunkButton;