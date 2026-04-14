import type { Metadata } from "next";
import { ContentImageGallery } from "@/components/ContentImageGallery";
import { PageScaffold } from "@/components/PageScaffold";
import { getSiteContent } from "@/lib/site";
import { sectionSubheadingClassName } from "@/lib/typography";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Projects",
    description: "Selected projects and work.",
  };
}

export default function ProjectsPage() {
  const site = getSiteContent();

  return (
    <PageScaffold title="Projects">
      <ul className="space-y-8">
        {site.projects.map((project) => (
          <li key={project.title} className="border-b border-[var(--color-ink)]/10 pb-8 last:border-0 last:pb-0">
            <h2 className={sectionSubheadingClassName}>{project.title}</h2>
            {project.Role ? (
              <p className="mt-1 text-xs font-medium tracking-[0.2em] text-[var(--color-muted)] uppercase">
                {project.Role}
              </p>
            ) : null}
            <p className="mt-2">{project.description}</p>
            <ContentImageGallery images={project.images ?? []} className="mt-4" />
            {project.tech.length > 0 ? (
              <p className="mt-2 text-xs tracking-wide text-[var(--color-muted)] uppercase">
                {project.tech.join(" · ")}
              </p>
            ) : null}
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-[var(--color-ink)] underline underline-offset-4"
              >
                View project
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </PageScaffold>
  );
}
