import type { Metadata } from "next";
import { ContentImageGallery } from "@/components/ContentImageGallery";
import { PassionComments } from "@/components/PassionComments";
import { PageScaffold } from "@/components/PageScaffold";
import { getSiteContent, PASSION_PAGE_LABEL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: PASSION_PAGE_LABEL,
    description: "Key achievements, community voice, and reader comments.",
  };
}

export default function PassionProjectsPage() {
  const site = getSiteContent();

  return (
    <PageScaffold title={PASSION_PAGE_LABEL}>
      <ul className="space-y-6">
        {site.passionProjects.map((p) => (
          <li key={p.title}>
            <h2 className="text-lg font-medium tracking-wide text-[var(--color-ink)] uppercase">
              {p.title}
            </h2>
            <p className="mt-2">{p.description}</p>
            <ContentImageGallery images={p.images ?? []} className="mt-4" />
          </li>
        ))}
      </ul>
      <PassionComments />
    </PageScaffold>
  );
}
