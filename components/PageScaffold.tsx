import Link from "next/link";
import type { ReactNode } from "react";

type PageScaffoldProps = {
  title: string;
  children: ReactNode;
};

export function PageScaffold({ title, children }: PageScaffoldProps) {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-10">
      <header className="mb-10">
        <Link
          href="/"
          className="text-xs font-medium tracking-[0.2em] text-[var(--color-muted)] uppercase underline-offset-4 hover:underline"
        >
          ← Home
        </Link>
        <h1 className="mt-6 font-[family-name:var(--font-great-vibes)] text-4xl text-[var(--color-ink)] md:text-5xl">
          {title}
        </h1>
      </header>
      <main className="space-y-6 text-[var(--color-muted)] leading-relaxed">{children}</main>
    </div>
  );
}
