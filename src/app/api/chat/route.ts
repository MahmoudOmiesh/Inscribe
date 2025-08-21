import { google } from "@ai-sdk/google";
import { streamText, type UIMessage, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: UIMessage[];
  };

  const result = streamText({
    model: google("gemini-2.5-flash"),
    prompt: convertToModelMessages(messages),
    abortSignal: req.signal,
    system: `You are an inline writing assistant for a plain‑text note editor.
             Output must be plain text only. Do not use Markdown, code blocks, lists, numbering, headings, emojis, links, quotes, or backticks. Do not echo instructions.
             Keep responses quite short. No prefaces or explanations—answer directly.
             Preserve the user’s language, tone, and basic formatting. Do not add extra whitespace.
             If asked to rewrite or continue, produce the improved continuation only. If ambiguous, choose the most reasonable concise interpretation.
             Stop as soon as the request is satisfied.`,
  });

  return result.toUIMessageStreamResponse();
}
