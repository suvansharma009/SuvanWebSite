import siteJson from "@/content/site.json";

/** Nav label and page title for the passion / achievements section. */
export const PASSION_PAGE_LABEL = "Key Achievements & Community Voice";

export type GalleryImage = {
  src: string;
  alt: string;
};

export type ProjectItem = {
  title: string;
  description: string;
  /** Optional subtitle shown on the Projects page when set. */
  Role?: string;
  link: string;
  tech: string[];
  /** Paths under `public/` (e.g. `/projects/foo.png`) or full image URLs. */
  images?: GalleryImage[];
};

export type HobbyItem = {
  title: string;
  description: string;
  images?: GalleryImage[];
};

export type PassionItem = {
  title: string;
  description: string;
  images?: GalleryImage[];
};

export type SiteContent = {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  bio: string;
  /** Optional photos on the About page (e.g. `/about/team.jpg` in `public/`). */
  aboutImages?: GalleryImage[];
  skills: string[];
  projects: ProjectItem[];
  hobbies: HobbyItem[];
  passionProjects: PassionItem[];
  social: {
    email: string;
    website: string;
    location: string;
    linkedin: string;
    github: string;
  };
  aiAlterEgo: {
    name: string;
    description: string;
  };
  heroImage: {
    src: string;
    alt: string;
  };
  avatar: {
    src: string;
    alt: string;
  };
};

export function getSiteContent(): SiteContent {
  return siteJson as SiteContent;
}

/** Flatten site facts for the chat system prompt (no secrets). */
export function getProfileContextForAI(): string {
  const s = getSiteContent();
  const lines: string[] = [
    `Name: ${s.name}`,
    `Professional title: ${s.title}`,
    `Tagline: ${s.tagline}`,
    `Introduction: ${s.intro}`,
    `Bio: ${s.bio}`,
    `Skills: ${s.skills.join(", ")}`,
    "Projects:",
    ...s.projects.map(
      (p) =>
        `  - ${p.title}${p.Role ? ` [${p.Role}]` : ""}: ${p.description}${p.link ? ` (link: ${p.link})` : ""}. Tech: ${p.tech.join(", ")}`,
    ),
    "Hobbies:",
    ...s.hobbies.map((h) => `  - ${h.title}: ${h.description}`),
    `${PASSION_PAGE_LABEL}:`,
    ...s.passionProjects.map((p) => `  - ${p.title}: ${p.description}`),
    `Contact email (public): ${s.social.email}`,
    s.social.website ? `Website: ${s.social.website}` : "",
    s.social.linkedin ? `LinkedIn: ${s.social.linkedin}` : "",
    s.social.github ? `GitHub: ${s.social.github}` : "",
    s.social.location ? `Location link: ${s.social.location}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
