import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Body = {
  mode: "analyze" | "compare";
  payload: unknown;
};

const analyzerPrompt = (syllabusText: string, track: string) => `You are an expert engineering career advisor.

A student in the "${track}" track has uploaded their college syllabus. Compare it against MODERN INDUSTRY requirements (2025) and return a 4-year, 8-semester roadmap of the MISSING modern tech skills they need to be hireable.

Return ONLY valid minified JSON, no markdown, matching exactly this shape:
{"semesters":[{"label":"Sem 1","year":1,"covered":["..."],"missing":[{"id":"s1-1","skill":"...","course":{"title":"...","provider":"Udemy","hours":18,"rating":4.7,"affiliateUrl":"#"}}]}]}

Rules:
- Exactly 8 semesters (Sem 1..Sem 8), years 1..4 (two per year).
- "covered" = 1-3 topics inferred from the syllabus for that semester.
- "missing" = 1-3 modern industry-critical skills NOT covered, each with a real course recommendation.
- provider must be one of: "Udemy","Coursera","edX".
- id must be unique and kebab-case.

--- SYLLABUS START ---
${syllabusText.slice(0, 18000)}
--- SYLLABUS END ---`;

const comparePrompt = (a: { name: string; text: string }, b: { name: string; text: string }, track: string) => `You are an engineering curriculum analyst.

Compare two college curriculums for the "${track}" track and score each across 6 key industry areas (0-100 coverage).

If the inputs below are short institution names (not full syllabi), infer the typical curriculum based on your knowledge of those institutions in India. If they are full syllabus text, analyze directly.

Return ONLY valid minified JSON, no markdown, exactly:
{"areas":["Fundamentals","Web/Mobile","Cloud/DevOps","AI & Data","System Design","Tooling"],"a":{"name":"${a.name}","scores":[0,0,0,0,0,0]},"b":{"name":"${b.name}","scores":[0,0,0,0,0,0]},"summary":"one-sentence verdict"}

Adapt "areas" to the track if more meaningful (e.g. VLSI → Digital Design, Verification, etc.), but always exactly 6 areas and 6 scores per college.

--- INSTITUTION A: ${a.name} ---
${a.text.slice(0, 8000)}

--- INSTITUTION B: ${b.name} ---
${b.text.slice(0, 8000)}`;

async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
  });
  const result = await model.generateContent(prompt);
  const text = result.response.text() ?? "";
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

export const Route = createFileRoute("/api/gemini")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Body;
          if (body.mode === "analyze") {
            const { syllabusText, track } = body.payload as { syllabusText: string; track: string };
            const result = await callGemini(analyzerPrompt(syllabusText, track));
            return Response.json(result);
          }
          if (body.mode === "compare") {
            const { a, b, track } = body.payload as {
              a: { name: string; text: string };
              b: { name: string; text: string };
              track: string;
            };
            const result = await callGemini(comparePrompt(a, b, track));
            return Response.json(result);
          }
          return new Response("Invalid mode", { status: 400 });
        } catch (e) {
          console.error("gemini route error:", e);
          return Response.json(
            { error: e instanceof Error ? e.message : "Unknown error" },
            { status: 500 },
          );
        }
      },
    },
  },
});