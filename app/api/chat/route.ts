import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getProfileContextForAI, getSiteContent } from "@/lib/site";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 4000;

export async function POST(req: NextRequest) {
  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = body.messages?.filter((m) => m.role === "user" || m.role === "assistant") ?? [];
  const messages = raw.slice(-MAX_MESSAGES);

  for (const m of messages) {
    if (typeof m.content !== "string" || m.content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json({ error: "Include a user message" }, { status: 400 });
  }

  const site = getSiteContent();
  const profile = getProfileContextForAI();
  const systemPrompt = `You are "${site.aiAlterEgo.name}", a friendly alter ego of ${site.name}. Answer only using the facts below. If something is not covered, say you do not have that information. Keep answers concise and in first person as the alter ego when natural.\n\n--- Facts ---\n${profile}`;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const demo = replyDemo(lastUser.content);
    return NextResponse.json({ reply: demo, demo: true as const });
  }

  const openai = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      max_tokens: 512,
    });
    const reply = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!reply) {
      return NextResponse.json({ error: "Empty response from model." }, { status: 502 });
    }
    return NextResponse.json({ reply, demo: false as const });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "The assistant could not respond. Try again later." },
      { status: 502 },
    );
  }
}

function replyDemo(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return "Hello! I am running in demo mode without OPENAI_API_KEY. Add your API key to .env.local for full conversational answers based on your site content.";
  }
  if (q.includes("project")) {
    return "Demo mode: your projects are listed in content/site.json and on the Projects page. Configure OPENAI_API_KEY for tailored answers.";
  }
  if (q.includes("who") || q.includes("name")) {
    return "Demo mode: open content/site.json to edit your name and bio—the live assistant will use that context once an API key is set.";
  }
  return "I am in demo mode. Set OPENAI_API_KEY in .env.local (and optionally OPENAI_MODEL) to enable the full AI alter ego.";
}
