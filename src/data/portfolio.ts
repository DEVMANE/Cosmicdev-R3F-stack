export type SectionId = "home" | "skills" | "experience" | "education" | "contact"

export interface PortfolioSection {
  id: SectionId
  name: string
  short: string
  content: {
    headline?: string
    subHeadline?: string
    location?: string
    summary?: string
    skillsTop?: string[]
    skillsTechnical?: string[]
    skillsMisc?: string[]
    experience?: {
      company: string
      role: string
      period: string
      bullets: string[]
    }[]
    education?: {
      school: string
      degree: string
      period: string
    }[]
    certifications?: string[]
    contact?: {
      phone?: string
      email?: string
      linkedin?: string
      portfolio?: string
      address?: string
    }
  }
}

export const sections: PortfolioSection[] = [
  {
    id: "home",
    name: "Home",
    short: "Welcome",
    content: {
      headline: "Pirapat Thananopparit",
      subHeadline:
        "Senior .NET Developer @ SET | Full Stack Engineer | Context Engineer | CyberSec | Lifelong Learner | Technology Evangelist",
      location: "Amphoe Thanyaburi, Pathum Thani, Thailand",
      summary:
        "A seasoned technology professional with 14 years of experience in software development and system analysis. My expertise spans web, app, and mobile platforms, with deep proficiency in full-stack web development, KIOSK solutions, and payment gateway integration in Thailand. I am an enthusiast of emerging technologies like AI/ML and Blockchain and thrive in roles that involve problem-solving and research & development.",
    },
  },
  {
    id: "skills",
    name: "Skills",
    short: "Strengths",
    content: {
      skillsTop: [
        "Team Leadership",
        "Critical Thinking and Problem Solving",
        "System Analyst and System Architecture",
        "Full-Stack Development",
        "Research and Proof of Concepts Development",
      ],
      skillsTechnical: [
        "14 Years of Web and System Development: 14 years of experience in software development and system analysis, 8 years of proficiency in web development, with 6 years as a full-stack developer.",
        "Platforms & Frameworks: ASP.NET, ASP.NET MVC, SiteCore CMS, WordPress, WCF, WPF.",
        "Databases: Oracle (10g, 11g), SQL Server, MySQL.",
        "ERP: Oracle 10g, Oracle 11g.",
        "Embedded Systems: Microcontroller programming, Windows CE.",
        "API Integration: Google API, Facebook API, Sabre Booking Engine, and various payment gateways.",
      ],
      skillsMisc: [
        "AI/ML: Experience with ChatGPT (GPT-5, GPT-5 Codex), Gemini, Stable Diffusion, ComfyUI, Midjourney, Pika, Suno, and Krita.",
        "Blockchain: Interest in Cryptocurrency, NFTs, DeFi, GameFi, and the Metaverse.",
      ],
    },
  },
  {
    id: "experience",
    name: "Experience",
    short: "What I did",
    content: {
      experience: [
        {
          company: "The Stock Exchange of Thailand",
          role: "Senior .Net Developer (Contracts)",
          period: "September 2025 - Present",
          bullets: [
            "Lead the design, development, and implementation of new SET systems to replace legacy platforms.",
            "Develop Windows applications, background services, and REST APIs to meet business and regulatory requirements.",
            "Integrate software components into fully functional and secure systems.",
            "Troubleshoot, debug, and upgrade existing systems for performance and reliability improvements.",
            "Mentor junior developers and perform code reviews to enforce coding standards.",
          ],
        },
        {
          company: "Extend IT Resource Co., Ltd.",
          role: "System Analyst (WPF)",
          period: "April 2024 - November 2024 (8 months)",
          bullets: [
            "Conducted application blueprinting and architecture overviews.",
            "Assisted in planning, designing, and developing new applications and enhancements.",
            "Collaborated with developers and DevOps to ensure proper system infrastructure and design.",
            "Coached, mentored, and supervised project teams.",
          ],
        },
        {
          company: "ONYX Hospitality Group",
          role: "Assistant Manager, Web Programming (E-Commerce & Distribution)",
          period: "September 2022 - April 2024 (1 year 8 months)",
          bullets: [
            "Implemented website designs and new functionality on SiteCore and WordPress CMS.",
            "Kept websites up-to-date with ASP.NET and ASP.NET MVC standards.",
            "Integrated Google API, Facebook API, and the Sabre Booking Engine.",
            "Supported web optimization, SEO, and provided user support and training.",
          ],
        },
      ],
    },
  },
  {
    id: "education",
    name: "Education & Certifications",
    short: "Learning",
    content: {
      education: [
        {
          school: "King Mongkut's Institute of Technology Ladkrabang",
          degree: "Bachelor of Science - B.Sc., Information Technology",
          period: "May 2006 - May 2010",
        },
      ],
      certifications: [
        "Critical Thinking and Problem Solving",
        "Cybersecurity Series",
        "Ethereum Smart Contract Programming 201",
        "Build your own Proof Of Stake Blockchain by Lukas Hubl",
        "Software Architecture: Patterns for Developers",
      ],
    },
  },
  {
    id: "contact",
    name: "Contact",
    short: "Reach out",
    content: {
      contact: {
        phone: "(+66) 635161711",
        email: "flow2dacode@gmail.com",
        linkedin: "www.linkedin.com/in/kushmane",
        portfolio: "thecosmic.dev/",
        address: "Thanyaburi, Pathum Thani, Thailand 12130",
      },
    },
  },
]