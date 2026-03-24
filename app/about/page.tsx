import type { Metadata } from "next";
import { ContentImageGallery } from "@/components/ContentImageGallery";
import { PageScaffold } from "@/components/PageScaffold";
import { getSiteContent } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteContent();
  return {
    title: "About",
    description: site.bio.slice(0, 160),
  };
}

export default function AboutPage() {
  const site = getSiteContent();

  return (
    <PageScaffold title="About me">
      <p className="text-[var(--color-ink)]">{site.bio}</p>
      <ContentImageGallery images={site.aboutImages ?? []} className="mt-6" />
      <div>
        <h2 className="mb-3 text-xs font-medium tracking-[0.2em] text-[var(--color-ink)] uppercase">
          Skills
        </h2>
        <ul className="flex flex-wrap gap-2">
          {site.skills.map((skill) => (
            <li
              key={skill}
              className="border border-[var(--color-ink)]/20 bg-[var(--color-paper-dark)] px-3 py-1 text-sm text-[var(--color-ink)]"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </PageScaffold>
  );
}
