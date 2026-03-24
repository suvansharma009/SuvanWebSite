import type { Metadata } from "next";
import { ContentImageGallery } from "@/components/ContentImageGallery";
import { PageScaffold } from "@/components/PageScaffold";
import { getSiteContent } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Hobbies",
    description: "Interests outside of work.",
  };
}

export default function HobbiesPage() {
  const site = getSiteContent();

  return (
    <PageScaffold title="Hobbies">
      <ul className="space-y-6">
        {site.hobbies.map((h) => (
          <li key={h.title}>
            <h2 className="text-lg font-medium tracking-wide text-[var(--color-ink)] uppercase">
              {h.title}
            </h2>
            <p className="mt-2">{h.description}</p>
            <ContentImageGallery images={h.images ?? []} className="mt-4" />
          </li>
        ))}
      </ul>
    </PageScaffold>
  );
}
