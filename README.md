# Yukti AI local demo

A React/Express campus workspace with Supabase-backed sample records, cloud AI through Gemini/Groq, and local semantic lost-and-found matching.

## Start

Use Node.js 22 or later. Run `npm install`, then `npm run prepare:model` once to download the quantized MiniLM model (about 24 MB) to ignored `.cache/models`.

Copy `.env.example` to `.env` if it does not already exist. Add your own `GEMINI_API_KEY` and/or `GROQ_API_KEY`. Never commit keys or put them in client-side VITE variables. Restart the server after changing the file.

For cloud persistence, set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` on the server and apply `supabase/migrations/202609170001_create_campus_demo_state.sql`. The secret key must never be exposed to the browser. If Supabase is unavailable, the interface keeps a browser-local fallback and reports the sync issue.

- `AI_PROVIDER=auto`: Gemini first, Groq fallback for text.
- `AI_PROVIDER=gemini` or `groq`: use only the selected provider.
- Image analysis currently requires Gemini. Groq is text-only here.
- Model names are configurable through `GEMINI_MODEL` and `GROQ_MODEL`; availability depends on your account.
- Requests may send entered content and relevant demo records to the configured cloud provider. Use sample data, not private campus records.

Run `npm run dev` and open http://localhost:3000. The server binds to 127.0.0.1 by default.

## Working flows

- Academics: sample timetable, attendance and course data.
- Documents: request → switch to administrator → change request status → download a sample PDF when ready.
- Complaints: submit → cloud or explicitly rule-based triage → comments and status updates.
- Hostel: request an outpass → administrator approves/rejects → view status; weekly dining menu.
- CampusFind: add a report or choose “Find possible matches.” MiniLM compares opposite-type lost/found descriptions locally. Similarity is not proof of ownership.
- Notices: filters, session bookmarks, read/unread updates.
- Feedback: ratings and comments saved to the shared demo database.
- Assistant, PromiseCheck and executive reports: live provider calls when keys are configured; explicit errors instead of invented fallback results.
- Mutable records sync through the local Express server to Supabase. Browser storage is retained as an offline fallback. Photos are limited to 512 KB; persistence errors are reported.

## Boundaries

This is **not a production campus system**. It has a real database but no SSO, password authentication, real student-information integration, institutionally valid certificates, staff dispatch or gate-entry verification. Roles are demo views, not security boundaries. Everyone using this demo shares its Supabase records. Do not expose this server publicly.

PromiseCheck examines supplied content. It does not search placement registries, verify accreditation, establish fraud, or provide professional legal/financial advice. AI output can be wrong.

Browser voice recognition and speech synthesis depend on browser/OS support and microphone permission. Some browsers use external speech services.

## Models and sources

- Local model: [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2), Apache-2.0. Weights are downloaded from Hugging Face.
- Inference code: [Hugging Face Transformers.js](https://github.com/huggingface/transformers.js), installed from npm; no arbitrary GitHub scripts are executed.
- [Gemini API](https://ai.google.dev/api/generate-content).
- [Groq chat API](https://console.groq.com/docs/text-chat).

## Verify / build

- `npm run lint`: TypeScript.
- `npm test`: provider transport mocks and schema validation.
- `npm run test:api`: local API smoke tests, including real MiniLM matching (start server first).
- `npm run build`: frontend and ESM server bundle.
- `npm start`: serve the built app from `dist/server.mjs`.

Cloud response quality and connectivity require your valid API keys and available provider quota; mock tests do not establish live access.
