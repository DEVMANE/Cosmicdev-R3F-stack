"use client";

import React from "react";
import { X } from "lucide-react";
import type { PortfolioSection, SectionId } from "@/data/portfolio";
import { sections } from "@/data/portfolio";
import { CyberpunkCard, CyberpunkButton, CyberpunkTitle } from "@/components/cyberpunk";

type Props = {
  openId?: SectionId | null;
  onClose: () => void;
};

const PanelSection: React.FC<{ section: PortfolioSection }> = ({ section }) => {
  const c = section.content;

  const getIcon = (sectionId: SectionId) => {
    switch (sectionId) {
      case "home":
        return <i className="fas fa-user"></i>;
      case "skills":
        return <i className="fas fa-brain"></i>;
      case "experience":
        return <i className="fas fa-briefcase"></i>;
      case "education":
        return <i className="fas fa-graduation-cap"></i>;
      case "contact":
        return <i className="fas fa-address-book"></i>;
      default:
        return <i className="fas fa-info"></i>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Home */}
      {section.id === "home" && (
        <CyberpunkCard
          icon={getIcon(section.id)}
          title={c.headline || "Home"}
          content={c.summary || ""}
          stats={<span className="cyberpunk-stat-value">{c.location}</span>}
        />
      )}

      {/* Skills */}
      {section.id === "skills" && (
        <div className="cyberpunk-cards-container">
          {c.skillsTop && c.skillsTop.length > 0 && (
            <CyberpunkCard
              icon={<i className="fas fa-star"></i>}
              title="Top Skills"
              content={c.skillsTop.join(", ")}
            />
          )}
          {c.skillsTechnical && c.skillsTechnical.length > 0 && (
            <CyberpunkCard
              icon={<i className="fas fa-code"></i>}
              title="Technical Expertise"
              content={c.skillsTechnical.join(", ")}
            />
          )}
          {c.skillsMisc && c.skillsMisc.length > 0 && (
            <CyberpunkCard
              icon={<i className="fas fa-rocket"></i>}
              title="Emerging Technologies"
              content={c.skillsMisc.join(", ")}
            />
          )}
        </div>
      )}

      {/* Experience */}
      {section.id === "experience" && c.experience && (
        <div className="cyberpunk-cards-container">
          {c.experience.map((exp, idx) => (
            <CyberpunkCard
              key={idx}
              icon={<i className="fas fa-building"></i>}
              title={exp.company}
              content={`${exp.role} | ${exp.period}\n\n${exp.bullets.join("\n• ")}`}
            />
          ))}
        </div>
      )}

      {/* Education */}
      {section.id === "education" && (
        <div className="cyberpunk-cards-container">
          {c.education && c.education.length > 0 && (
            <>
              {c.education.map((e, i) => (
                <CyberpunkCard
                  key={i}
                  icon={<i className="fas fa-university"></i>}
                  title={e.school}
                  content={`${e.degree}\n${e.period}`}
                />
              ))}
            </>
          )}
          {c.certifications && c.certifications.length > 0 && (
            <CyberpunkCard
              icon={<i className="fas fa-certificate"></i>}
              title="Certifications"
              content={c.certifications.join(", ")}
            />
          )}
        </div>
      )}

      {/* Contact */}
      {section.id === "contact" && c.contact && (
        <CyberpunkCard
          icon={getIcon(section.id)}
          title="Contact Information"
          content={`Phone: ${c.contact.phone || "N/A"}
Email: ${c.contact.email || "N/A"}
LinkedIn: ${c.contact.linkedin || "N/A"}
Portfolio: ${c.contact.portfolio || "N/A"}
Address: ${c.contact.address || "N/A"}`}
        />
      )}
    </div>
  );
};

const InfoPanel: React.FC<Props> = ({ openId, onClose }) => {
  const section = sections.find((s) => s.id === openId);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!section) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cyberpunk-body"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      {/* Background effects */}
      <div className="neon-light"></div>
      <div className="neon-light"></div>
      <div className="energy-line"></div>
      <div className="energy-line"></div>

      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative max-h-[80vh] w-[92vw] sm:w-[95vw] max-w-[100%] overflow-y-auto cyberpunk-container cyberpunk-scene cyberpunk-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-cyan-400/30 bg-black/60 hover:bg-black/80 text-cyan-200 hover:text-cyan-100 z-10"
        >
          <X size={18} />
        </button>
        <CyberpunkTitle subtitle={section.short}>
          {section.name}
        </CyberpunkTitle>
        <div className="prose prose-invert max-w-none">
          <PanelSection section={section} />
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;