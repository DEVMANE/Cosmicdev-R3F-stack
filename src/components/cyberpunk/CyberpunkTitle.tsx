"use client";

import React from "react";

interface CyberpunkTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

const CyberpunkTitle: React.FC<CyberpunkTitleProps> = ({
  children,
  subtitle,
  className = "",
}) => {
  return (
    <div className={`cyberpunk-title-container ${className}`}>
      <h1 className="cyberpunk-main-title">{children}</h1>
      {subtitle && <p className="cyberpunk-subtitle">{subtitle}</p>}
    </div>
  );
};

export default CyberpunkTitle;