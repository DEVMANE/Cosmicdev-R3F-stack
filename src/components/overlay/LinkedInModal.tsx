"use client";

import React from "react";
import Image from "next/image";
import { Linkedin, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const LINKEDIN_URL = "https://www.linkedin.com/in/kushmane/";

const LinkedInModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-cyan-300/70 bg-black/60 p-6 text-center shadow-[0_0_35px_rgba(34,211,238,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close LinkedIn profile"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/50 bg-black/40 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.5)] transition hover:scale-105 hover:text-cyan-50"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mb-5 h-40 w-40 overflow-hidden rounded-full border-2 border-cyan-200/80 shadow-[0_0_30px_rgba(34,211,238,0.75)]">
          <Image
            src="/images/linkedin-profile.jpg"
            alt="Pirapat Thananopparit LinkedIn portrait"
            width={240}
            height={240}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <h2 className="text-2xl font-semibold text-cyan-100">Pirapat Thananopparit</h2>
        <p className="mt-2 text-sm text-cyan-100/90">
          Senior .NET Developer · Full Stack Engineer · Technology Evangelist
        </p>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-500/30 px-5 py-2 text-sm font-semibold text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.65)] transition hover:scale-105 hover:bg-cyan-400/40"
        >
          <Linkedin size={18} />
          View LinkedIn Profile
        </a>
      </div>
    </div>
  );
};

export default LinkedInModal;