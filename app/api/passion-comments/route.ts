import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import type { PassionComment } from "@/lib/passion-comments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "data", "passion-comments.json");

const MAX_BODY = 2000;
const MAX_AUTHOR = 120;

async function readComments(): Promise<PassionComment[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
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
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return [];
    throw e;
  }
}

async function writeComments(comments: PassionComment[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(comments, null, 2) + "\n", "utf8");
}

export async function GET() {
  try {
    const comments = await readComments();
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: { author?: unknown; body?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text.length) {
    return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
  }
  if (text.length > MAX_BODY) {
    return NextResponse.json({ error: `Comment must be at most ${MAX_BODY} characters` }, { status: 400 });
  }

  let author = typeof body.author === "string" ? body.author.trim() : "";
  if (author.length > MAX_AUTHOR) {
    return NextResponse.json({ error: `Name must be at most ${MAX_AUTHOR} characters` }, { status: 400 });
  }
  if (!author.length) author = "Guest";

  const comment: PassionComment = {
    id: crypto.randomUUID(),
    author,
    body: text,
    createdAt: new Date().toISOString(),
  };

  try {
    const existing = await readComments();
    existing.push(comment);
    await writeComments(existing);
    return NextResponse.json(comment, { status: 201 });
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "EROFS" || err.code === "EPERM" || err.code === "EACCES") {
      return NextResponse.json(
        { error: "persist_failed", message: "Server storage is read-only on this host." },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}
