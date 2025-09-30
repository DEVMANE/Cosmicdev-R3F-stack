"use client";

import React from "react";

interface CyberpunkCardProps {
  icon?: React.ReactNode;
  title: string;
  content: string;
  stats?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const CyberpunkCard: React.FC<CyberpunkCardProps> = ({
  icon,
  title,
  content,
  stats,
  onClick,
  className = "",
}) => {
  return (
    <div className={`cyberpunk-card ${className}`} onClick={onClick}>
      {icon && <div className="cyberpunk-card-icon">{icon}</div>}
      <div>
        <h2 className="cyberpunk-card-title">{title}</h2>
        <p className="cyberpunk-card-content">{content}</p>
      </div>
      {stats && <div className="cyberpunk-card-stats">{stats}</div>}
    </div>
  );
};

export default CyberpunkCard;