import Image from "next/image";
import { NavButton } from "@/components/NavButton";
import { ContactFooter } from "@/components/ContactFooter";
import { getSiteContent, PASSION_PAGE_LABEL } from "@/lib/site";

export default function HomePage() {
  const site = getSiteContent();
  const hero = site.heroImage ?? {
    src: "/hero.jpg",
    alt: "City skyline hero background",
  };

  return (
    <div className="relative min-h-screen">
      <section
        className="relative min-h-[220px] w-full overflow-hidden bg-[#1a1918] md:min-h-[260px]"
        aria-label="Hero"
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#1a1918]/75 via-[#2c2a28]/45 to-[#1a1918]/88"
          aria-hidden
        />
      </section>

      <div
        id="main"
        className="relative z-20 mx-auto flex max-w-lg flex-col items-center px-4 pb-6"
        style={{ marginTop: "-4.5rem" }}
      >
        <div className="relative z-10 mb-4 rounded-full border-4 border-[var(--color-ink)] bg-white p-1 shadow-sm">
          <Image
            src={site.avatar.src}
            alt={site.avatar.alt}
            width={144}
            height={144}
            className="h-36 w-36 rounded-full object-cover"
            priority
          />
        </div>

        <div className="w-full rounded-t-3xl bg-[var(--color-paper)] px-2 pb-2 pt-2 text-center shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <h1 className="font-[family-name:var(--font-great-vibes)] text-5xl text-[var(--color-ink)] md:text-6xl">
            {site.name}
          </h1>
          <p className="mt-2 text-xs font-medium tracking-[0.35em] text-[var(--color-muted)] uppercase">
            {site.title}
          </p>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
            {site.intro}
          </p>

          <nav className="mt-10 flex w-full flex-col items-center gap-3" aria-label="Primary">
            <NavButton href="/about">About me</NavButton>
            <NavButton href="/projects">Projects</NavButton>
            <NavButton href="/hobbies">Hobbies</NavButton>
            <NavButton href="/passion-projects">{PASSION_PAGE_LABEL}</NavButton>
            <NavButton href="/ai-alter-ego">AI alter ego</NavButton>
          </nav>

          <ContactFooter />
        </div>
      </div>
    </div>
  );
}
