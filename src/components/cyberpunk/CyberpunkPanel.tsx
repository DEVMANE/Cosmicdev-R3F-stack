"use client";

import React from "react";

interface CyberpunkPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const CyberpunkPanel: React.FC<CyberpunkPanelProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`cyberpunk-control-panel ${className}`}>
      <div className="cyberpunk-panel-header">
        <div className="cyberpunk-panel-title">{title}</div>
        <div className="cyberpunk-panel-status"></div>
      </div>
      {children}
    </div>
  );
};

export default CyberpunkPanel;