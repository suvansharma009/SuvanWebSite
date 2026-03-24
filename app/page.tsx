import Image from "next/image";
import Link from "next/link";
import { NavButton } from "@/components/NavButton";
import { ContactFooter } from "@/components/ContactFooter";
import { getSiteContent, PASSION_PAGE_LABEL } from "@/lib/site";

function IconSearch() {
  return (
    <svg aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg aria-hidden className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

export default function HomePage() {
  const site = getSiteContent();

  return (
    <div className="relative min-h-screen">
      <section
        className="relative min-h-[120px] w-full bg-gradient-to-br from-[#3d3b39] via-[#2c2a28] to-[#1a1918] md:min-h-[140px]"
        aria-label="Hero"
      >
        <div className="relative z-10 flex items-start justify-between px-4 pt-2 text-white/95 md:px-6 md:pt-2">
          <Link
            href="#main"
            className="rounded p-1 opacity-90 transition hover:opacity-100"
            aria-label="Skip to content"
          >
            <IconSearch />
          </Link>
          <button
            type="button"
            className="rounded p-1 opacity-90 transition hover:opacity-100 md:hidden"
            aria-label="Menu (decorative)"
          >
            <IconMenu />
          </button>
        </div>
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
