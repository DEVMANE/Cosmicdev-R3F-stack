"use client";

import React from "react";
import { X } from "lucide-react";
import type { PortfolioSection, SectionId } from "@/data/portfolio";
import { sections } from "@/data/portfolio";

type Props = {
  openId?: SectionId | null;
  onClose: () => void;
};

const PanelSection: React.FC<{ section: PortfolioSection }> = ({ section }) => {
  const c = section.content;
  return (
    <div className="space-y-6">
      {/* Home */}
      {section.id === "home" && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">{c.headline}</h2>
          {c.subHeadline && <p className="text-cyan-300">{c.subHeadline}</p>}
          {c.location && <p className="text-sm opacity-80">{c.location}</p>}
          {c.summary && <p className="leading-relaxed">{c.summary}</p>}
        </div>
      )}

      {/* Skills */}
      {section.id === "skills" && (
        <div className="space-y-4">
          {c.skillsTop && c.skillsTop.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-cyan-300">Top Skills</h3>
              <ul className="list-disc pl-5 space-y-1">
                {c.skillsTop.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {c.skillsTechnical && c.skillsTechnical.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-cyan-300">Technical Expertise</h3>
              <ul className="list-disc pl-5 space-y-1">
                {c.skillsTechnical.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {c.skillsMisc && c.skillsMisc.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-cyan-300">Emerging Technologies</h3>
              <ul className="list-disc pl-5 space-y-1">
                {c.skillsMisc.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Experience */}
      {section.id === "experience" && c.experience && (
        <div className="space-y-6">
          {c.experience.map((exp, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold">{exp.company}</h3>
              <p className="text-sm opacity-80">{exp.role} | {exp.period}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {section.id === "education" && (
        <div className="space-y-4">
          {c.education && c.education.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-cyan-300">Education</h3>
              <ul className="space-y-2">
                {c.education.map((e, i) => (
                  <li key={i}>
                    <p className="font-medium">{e.school}</p>
                    <p className="text-sm">{e.degree}</p>
                    <p className="text-xs opacity-70">{e.period}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {c.certifications && c.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-cyan-300">Certifications</h3>
              <ul className="list-disc pl-5 space-y-1">
                {c.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Contact */}
      {section.id === "contact" && c.contact && (
        <div className="space-y-2">
          {c.contact.phone && <p><span className="text-cyan-300">Phone:</span> {c.contact.phone}</p>}
          {c.contact.email && <p><span className="text-cyan-300">Email:</span> {c.contact.email}</p>}
          {c.contact.linkedin && <p><span className="text-cyan-300">LinkedIn:</span> {c.contact.linkedin}</p>}
          {c.contact.portfolio && <p><span className="text-cyan-300">Portfolio:</span> {c.contact.portfolio}</p>}
          {c.contact.address && <p><span className="text-cyan-300">Address:</span> {c.contact.address}</p>}
        </div>
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative max-h-[80vh] w-[92vw] sm:w-[720px] overflow-y-auto rounded-xl border border-cyan-400/40 bg-white/10 dark:bg-black/20 backdrop-blur-xl p-6 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-cyan-400/30 bg-white/10 hover:bg-white/20 text-cyan-200 hover:text-cyan-100"
        >
          <X size={18} />
        </button>
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-wide">
            {section.name}
          </h2>
          <p className="text-sm text-cyan-300">{section.short}</p>
        </div>
        <div className="prose prose-invert max-w-none">
          <PanelSection section={section} />
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;