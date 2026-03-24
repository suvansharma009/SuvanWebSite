import { getSiteContent } from "@/lib/site";

function IconGlobe() {
  return (
    <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z"
      />
    </svg>
  );
}

function IconEnvelope() {
  return (
    <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

export function ContactFooter() {
  const { social } = getSiteContent();
  const mailto = social.email ? `mailto:${social.email}` : undefined;

  const items: { href: string; label: string; icon: React.ReactNode }[] = [];
  if (social.website) {
    items.push({ href: social.website, label: "Website", icon: <IconGlobe /> });
  }
  if (mailto) {
    items.push({ href: mailto, label: "Email", icon: <IconEnvelope /> });
  }
  if (social.location) {
    items.push({ href: social.location, label: "Location", icon: <IconPin /> });
  }

  return (
    <footer className="mt-12 flex flex-col items-center gap-4 pb-10">
      <p className="text-xs font-medium tracking-[0.25em] text-[var(--color-muted)] uppercase">
        Contact me
      </p>
      <div className="h-px w-24 bg-[var(--color-ink)]" aria-hidden />
      {items.length > 0 ? (
        <ul className="flex items-center justify-center gap-8 text-[var(--color-ink)]">
          {items.map(({ href, label, icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="transition hover:opacity-70"
                aria-label={label}
              >
                {icon}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-sm text-center text-xs text-[var(--color-muted)]">
          Add website, email, or location in{" "}
          <code className="rounded bg-neutral-200 px-1">content/site.json</code>.
        </p>
      )}
    </footer>
  );
}
