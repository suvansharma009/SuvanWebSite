import type { Metadata } from "next";
import { PageScaffold } from "@/components/PageScaffold";
import { AlterEgoChat } from "@/components/AlterEgoChat";
import { getSiteContent } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteContent();
  return {
    title: "AI alter ego",
    description: site.aiAlterEgo.description,
  };
}

export default function AiAlterEgoPage() {
  const site = getSiteContent();

  return (
    <PageScaffold title={site.aiAlterEgo.name}>
      <AlterEgoChat intro={site.aiAlterEgo.description} />
    </PageScaffold>
  );
}
