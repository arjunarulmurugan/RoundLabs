# Video Analysis — Serverless Deployment

The RoundLabs frontend stays static (GitHub Pages). Real video analysis runs on a
**separate serverless endpoint** that holds the provider key. The browser only ever
knows the endpoint URL (`VITE_VIDEO_ANALYSIS_ENDPOINT`).

```
GitHub Pages frontend  ──POST video──▶  serverless endpoint  ──▶  multimodal provider
        (no secret)                        (holds PROVIDER_API_KEY)
```

If the endpoint is unset or fails, the app keeps working via the honest manual
fallback (`src/lib/video/videoAnalysis.ts` → `analyzeVideo` returns `unavailable`;
the UI labels results **Manual (no AI claim)**, never "AI analyzed").

## Contract
The endpoint must return JSON matching `VideoAnalysisResult` (see
`src/lib/video/videoAnalysis.ts`). The client runs `validateVideoAnalysisResult`
before rendering; invalid responses are rejected, not shown.

## Provider-neutral adapter (example handler)
Deploy to any serverless host (Vercel/Netlify/Cloudflare Workers/AWS Lambda).
The key lives in the function environment, never in the repo:

```ts
// api/analyze-video.ts  (example — not committed as a live function)
export default async function handler(req: Request): Promise<Response> {
  const form = await req.formData();
  const video = form.get("video");
  // Enforce server-side limits again (never trust the client).
  // const provider = new Provider({ apiKey: process.env.PROVIDER_API_KEY });
  // const raw = await provider.analyze(video, { model: process.env.PROVIDER_MODEL });
  const result = {
    recognitionMethod: "video-analysis",
    game: undefined,            // set from the model output
    relevantMoments: [],
    observedFacts: [],
    inferredFacts: [],          // each MUST carry confidence + explanation
    unknowns: [],
    warnings: [],
    summary: "…",
  };
  return new Response(JSON.stringify(result), { headers: { "content-type": "application/json" } });
}
```

## Security & retention
- No provider key in frontend code (enforced by a test that scans the client lib).
- Upload size/duration limits on both client and server.
- Do not persist video unless explicitly required; document retention if you do.
- Do not log signed upload URLs or tokens.
- Configure CORS to allow only the Pages origin.

## Env
- Client: `VITE_VIDEO_ANALYSIS_ENDPOINT` (URL only).
- Server: `PROVIDER_API_KEY`, `PROVIDER_MODEL` (never `VITE_`-prefixed).
