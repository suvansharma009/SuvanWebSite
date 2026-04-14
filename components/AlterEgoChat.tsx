"use client";

import { useCallback, useRef, useState } from "react";

type Role = "user" | "assistant";

type Msg = { role: Role; content: string };

export function AlterEgoChat({ intro }: { intro: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const nextMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    scrollToEnd();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        demo?: boolean;
      };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      const reply = data.reply ?? "";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      scrollToEnd();
    } catch {
      setError("Network error. Try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, scrollToEnd]);

  return (
    <div className="mt-8 space-y-4">
      <p className="text-sm text-[var(--color-muted)]">{intro}</p>

      <div
        ref={listRef}
        className="max-h-[min(420px,55vh)] min-h-[120px] space-y-4 overflow-y-auto rounded border border-[var(--color-ink)]/15 bg-[var(--color-paper-dark)]/50 p-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 && !loading ? (
          <p className="text-sm text-[var(--color-muted)]">Ask a question to begin.</p>
        ) : null}
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={
              m.role === "user"
                ? "ml-4 rounded-lg border border-[var(--color-ink)]/20 bg-white px-3 py-2 text-[var(--color-ink)]"
                : "mr-4 text-[var(--color-muted)]"
            }
          >
            <span className="sr-only">{m.role === "user" ? "You: " : "Assistant: "}</span>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
          </div>
        ))}
        {loading ? (
          <p className="text-sm text-[var(--color-muted)]" aria-busy="true">
            Thinking…
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Message to AI alter ego
        </label>
        <input
          id="chat-input"
          name="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question…"
          className="min-h-11 flex-1 border border-[var(--color-ink)] bg-white px-3 py-2 text-[var(--color-ink)] placeholder:text-neutral-400"
          autoComplete="off"
          disabled={loading}
        />
        <button
          type="submit"
          className="min-h-11 border border-[var(--color-ink)] bg-[var(--color-paper-dark)] px-6 text-sm font-medium tracking-[0.15em] text-[var(--color-ink)] uppercase transition hover:bg-neutral-200/80 disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
