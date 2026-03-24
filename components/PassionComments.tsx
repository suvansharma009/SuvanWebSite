"use client";

import { useCallback, useEffect, useState } from "react";
import type { PassionComment } from "@/lib/passion-comments";

const LOCAL_KEY = "suvan_passion_comments_local_v1";

function loadLocal(): PassionComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is PassionComment =>
        typeof c === "object" &&
        c !== null &&
        typeof (c as PassionComment).id === "string" &&
        typeof (c as PassionComment).body === "string" &&
        typeof (c as PassionComment).createdAt === "string",
    );
  } catch {
    return [];
  }
}

function saveLocal(comments: PassionComment[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(comments));
}

export function PassionComments() {
  const [serverComments, setServerComments] = useState<PassionComment[]>([]);
  const [localOnly, setLocalOnly] = useState<PassionComment[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/passion-comments", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as PassionComment[];
        setServerComments(Array.isArray(data) ? data : []);
      } else {
        setServerComments([]);
      }
    } catch {
      setServerComments([]);
    } finally {
      setLoading(false);
    }
    setLocalOnly(loadLocal());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const merged = [...serverComments, ...localOnly].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const localIds = new Set(localOnly.map((c) => c.id));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setNotice(null);

    try {
      const res = await fetch("/api/passion-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim() || undefined,
          body: trimmed,
        }),
      });

      if (res.ok) {
        setBody("");
        setAuthor("");
        await refresh();
        return;
      }

      if (res.status === 503) {
        const c: PassionComment = {
          id: `local-${crypto.randomUUID()}`,
          author: author.trim() || "Guest",
          body: trimmed,
          createdAt: new Date().toISOString(),
        };
        const next = [c, ...loadLocal()];
        saveLocal(next);
        setLocalOnly(next);
        setBody("");
        setAuthor("");
        setNotice(
          "This deployment cannot save comments on the server. Your note was saved only in this browser on this device.",
        );
        return;
      }

      const err = (await res.json().catch(() => ({}))) as { error?: string };
      setNotice(err.error ?? "Could not post your comment. Try again.");
    } catch {
      setNotice("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-14 border-t border-[var(--color-paper-dark)] pt-10" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-lg font-medium tracking-wide text-[var(--color-ink)] uppercase">
        Comments
      </h2>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Share encouragement or feedback. Comments appear below after you post.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="comment-author" className="sr-only">
            Name (optional)
          </label>
          <input
            id="comment-author"
            type="text"
            name="author"
            autoComplete="nickname"
            maxLength={120}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Name (optional)"
            className="w-full rounded-lg border border-[var(--color-paper-dark)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          />
        </div>
        <div>
          <label htmlFor="comment-body" className="sr-only">
            Comment
          </label>
          <textarea
            id="comment-body"
            name="body"
            required
            rows={4}
            maxLength={2000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your comment…"
            className="w-full resize-y rounded-lg border border-[var(--color-paper-dark)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="rounded-lg border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2 text-sm font-medium text-[var(--color-paper)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Posting…" : "Post comment"}
        </button>
      </form>

      {notice ? (
        <p className="mt-4 text-sm text-[var(--color-muted)]" role="status">
          {notice}
        </p>
      ) : null}

      <div className="mt-8">
        <h3 className="text-xs font-medium tracking-[0.2em] text-[var(--color-muted)] uppercase">Recent</h3>
        {loading ? (
          <p className="mt-4 text-sm text-[var(--color-muted)]">Loading…</p>
        ) : merged.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-muted)]">No comments yet. Be the first.</p>
        ) : (
          <ul className="mt-4 space-y-4" aria-live="polite">
            {merged.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-[var(--color-paper-dark)] bg-white/60 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-[var(--color-ink)]">{c.author}</span>
                  <time
                    dateTime={c.createdAt}
                    className="text-xs text-[var(--color-muted)]"
                  >
                    {new Date(c.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </div>
                {localIds.has(c.id) ? (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">Saved on this device only</p>
                ) : null}
                <p className="mt-2 whitespace-pre-wrap text-[var(--color-muted)]">{c.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
