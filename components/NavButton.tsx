import Link from "next/link";

type NavButtonProps = {
  href: string;
  children: React.ReactNode;
};

export function NavButton({ href, children }: NavButtonProps) {
  return (
    <Link
      href={href}
      className="block w-full max-w-md border border-[var(--color-ink)] bg-[var(--color-paper-dark)] px-6 py-4 text-center text-sm font-medium tracking-[0.2em] text-[var(--color-ink)] uppercase transition hover:bg-neutral-200/80"
    >
      {children}
    </Link>
  );
}
