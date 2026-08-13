# Formix — a Typeform clone

A full-stack clone of Typeform: a drag-and-drop form builder, a polished animated
one-question-at-a-time respondent experience, and a results dashboard with
per-question summary stats.

> Built as an SDE fullstack assignment. The app is branded "Formix" rather than
> "Typeform" to avoid using the original product's trademark/name directly —
> functionally and visually it follows the same patterns the assignment asks for.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router, TypeScript), Tailwind CSS v4, TanStack Query, Framer Motion, dnd-kit, sonner (toasts) |
| Backend | Python, FastAPI, SQLAlchemy 2.0 |
| Database | SQLite (file-based, schema in `backend/app/models.py`) |
| Auth | None — a single default creator is seeded and used for all creator-side actions, per the assignment's "simplified auth" note. The public respondent flow requires no auth at all. |

## Project structure

```
typeform-builder/
├── backend/                 FastAPI app
│   ├── app/
│   │   ├── main.py          App factory, CORS, startup seeding
│   │   ├── database.py      SQLAlchemy engine/session
│   │   ├── models.py        ORM models (schema)
│   │   ├── schemas.py       Pydantic request/response models
│   │   ├── validation.py    Server-side answer validation
│   │   ├── deps.py          Default-creator dependency
│   │   ├── seed.py          Seed data (forms + responses)
│   │   └── routers/
│   │       ├── forms.py     Creator-side CRUD, publish, responses, summary, CSV export
│   │       └── public.py    Public form fetch + response submission
│   ├── requirements.txt
│   └── render.yaml          Render.com blueprint (backend deploy)
└── frontend/                 Next.js app
    └── src/
        ├── app/               Routes (dashboard, builder, respondent, results)
        ├── components/        UI grouped by feature (builder, respondent, results, dashboard, ui)
        └── lib/               API client, shared types, question-type metadata, validation
```

## Getting started

### Prerequisites
Python 3.12+, Node.js 20+, npm.

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate      # Windows (git-bash). Use `source venv/bin/activate` on macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

On first run the app creates `backend/typeform.db` (SQLite) and automatically seeds
it with a default creator, two published forms (mixed question types, with sample
responses) and one draft form — the API is immediately usable at
`http://localhost:8000`. Interactive API docs: `http://localhost:8000/docs`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL defaults to http://localhost:8000
npm run dev
```

Open `http://localhost:3000`.

## Architecture overview

- **Creator dashboard** (`/`) lists forms with status + response/question counts,
  with search, status filtering, and sorting (last updated / most responses /
  title), and supports create / rename / duplicate / delete / publish-unpublish,
  all via modals and toasts.
- **Builder** (`/forms/[id]/edit`) is a three-pane layout: a drag-to-reorder question
  list (dnd-kit) on the left — each question can also be duplicated in place — an
  editor for the selected question in the center, and a live, interactive preview
  of that question (styled like the real respondent screen) on the right. A
  Settings modal covers the welcome screen text, thank-you message, and
  theme/background color. Edits are debounced and auto-saved (~900ms after the
  last change) with a "Saving… / Saved" indicator, rather than a single big "Save"
  button — closer to how Typeform's own editor behaves. New questions are
  optimistic: they get a temporary negative client-side id and are reconciled
  with the real server id after the next autosave.
- **Respondent flow** (`/f/[slug]` for a published form, plus `/forms/[id]/preview`
  for the creator to test drafts) is one shared `RespondentFlow` component: a
  welcome screen, one animated full-screen question at a time (Framer Motion slide
  transitions), a top progress bar, Enter/↑/↓ keyboard navigation, letter-key
  selection for multiple choice, inline client-side validation, and a thank-you
  screen. The preview route reuses the exact same component in a "preview" mode
  that skips persistence, so what the creator sees while previewing a draft is
  pixel-for-pixel what a respondent would see once published.
- **Results** (`/forms/[id]/results`) shows response/completion stat tiles, a
  per-question summary (bar breakdown for choice/yes-no questions, averages for
  number/rating, sample answers for free text), a responses table, a modal with
  the full detail of a single response, and CSV export.
- **Validation happens twice**: instantly in the browser (`lib/validate-answer.ts`)
  for responsiveness, and again authoritatively on the server
  (`app/validation.py`) before a response is ever persisted — the client check is a
  UX nicety, not the source of truth.

## Bonus features implemented

- **CSV export** — `GET /api/forms/{id}/responses/export.csv`, exposed as an
  "Export CSV" button on the results page.
- **Partial-response tracking / completion rate** — `responses.completed` +
  nullable `submitted_at` let a response persist even if a respondent drops off
  mid-form; the results page shows total vs. completed vs. partial with a small
  completion bar, backed by `GET /api/forms/{id}/summary`.
- **Custom themes** — per-form accent color and background color, editable from
  the builder's Settings modal, applied live to the builder's preview panel and
  to the actual respondent flow.
- **Dark mode** — a toggle (top-right of the dashboard/builder/results headers)
  switches the *creator-facing* app shell between light and dark via a CSS
  custom-property theme (`globals.css` / `lib/theme.ts`), persisted to
  `localStorage`. This is deliberately scoped away from the public respondent
  flow and the builder's live-preview panel, which always render with the
  *form's own* theme (`theme_color`/`theme_background`) regardless of the
  creator's app preference — a respondent should never see the creator's
  personal dark-mode setting bleed into the form they're filling out.

Not implemented (out of scope per the assignment's own bonus/mocked list):
logic jumps / conditional branching, file-upload questions.

## Database schema

```
creators (1) ──< forms (1) ──< questions
                    │
                    └──< responses (1) ──< answers >── questions
```

- **creators** — `id, name, email, created_at`. Single seeded row; stands in for
  real authentication (see Assumptions).
- **forms** — `id, creator_id, title, description, status(draft|published),
  share_slug (unique, used in the public URL), welcome_title, welcome_description,
  thank_you_message, theme_color, theme_background, created_at, updated_at,
  published_at`.
- **questions** — `id, form_id, type, title, description, required, order_index,
  options (JSON: [{id,label}], used by multiple_choice/dropdown), settings (JSON:
  e.g. {max} for rating, {min,max} for number)`. `order_index` drives the drag-drop
  order; the builder always PUTs the full ordered list, which lets the backend
  diff-and-replace (update by id, insert new, delete removed) in one transaction.
- **responses** — `id, form_id, started_at, submitted_at, completed`. `completed`
  and the nullable `submitted_at` support partial-response tracking: a response can
  exist with only some answers if a respondent drops off.
- **answers** — `id, response_id, question_id, value (JSON — string/number/bool/
  option-id depending on question type), value_text (denormalized human-readable
  string used by the results table and CSV export)`. Storing the raw typed `value`
  as JSON alongside a rendered `value_text` avoids a wide sparse table (one column
  per possible answer shape) while still making the results/export code trivial.

## API overview

All creator-side routes assume the single seeded creator (no auth header needed).

| Method & path | Purpose |
|---|---|
| `GET /api/forms` | List forms with status + response/question counts |
| `POST /api/forms` | Create a form |
| `GET /api/forms/{id}` | Get a form with its questions |
| `PATCH /api/forms/{id}` | Update form metadata (title, theme, thank-you message, …) |
| `PUT /api/forms/{id}/questions` | Replace the full ordered question list (add/update/reorder/delete in one call) |
| `DELETE /api/forms/{id}` | Delete a form (cascades to questions/responses/answers) |
| `POST /api/forms/{id}/duplicate` | Duplicate a form as a new draft |
| `POST /api/forms/{id}/publish` / `unpublish` | Toggle publish status (publish requires ≥1 question) |
| `GET /api/forms/{id}/responses` | List responses (summary rows) |
| `GET /api/forms/{id}/responses/{response_id}` | Full detail of one response |
| `GET /api/forms/{id}/responses/export.csv` | CSV export (bonus) |
| `GET /api/forms/{id}/summary` | Per-question aggregate stats + completion rate |
| `GET /api/public/forms/{share_slug}` | Public: fetch a *published* form for filling |
| `POST /api/public/forms/{share_slug}/responses` | Public: submit a response (server-validated; 422 with per-question errors on failure) |

Full interactive docs are auto-generated by FastAPI at `/docs`.

## Assumptions & simplifications

- **Auth**: per the assignment, real creator auth is out of scope. A single
  default creator is auto-created on first run and implicitly owns every form.
- **Question options** use a stable `id` distinct from their `label` so relabeling
  an option doesn't orphan existing answers that reference it.
- **Reordering/editing questions on a form with existing responses**: the
  "replace by id" save strategy keeps existing answers linked to the same question
  row as long as the question itself isn't deleted; deleting a question deletes its
  historical answers too (cascade), which matches Typeform's own behavior.
- **Partial responses**: a response row is created as soon as a respondent starts
  answering in spirit, but this implementation persists once per `Enter`/submit
  action rather than one write per keystroke; the seed data includes a few
  `completed: false` responses to demonstrate the completion-rate bonus.
- **Logic jumps, integrations, payments/file-upload, and team collaboration** are
  explicitly out of scope per the assignment and are not present (no placeholder
  UI was added for them since the brief marks them optional-mock).

## Deployment

This repo is deploy-ready but has **not been deployed by the assistant**, since
doing so needs the user's own Vercel/Render/Railway account credentials, which
weren't available in this environment. To deploy:

**Backend (Render, using the included blueprint):**
1. Push this repo to GitHub (already done).
2. On Render: New → Blueprint → point at this repo → it will read
   `backend/render.yaml` and deploy `backend/` as a web service automatically.
   (Any other host works too — the app is a standard `uvicorn app.main:app` ASGI app.)
3. Note the resulting URL (e.g. `https://typeform-builder-api.onrender.com`).

**Frontend (Vercel):**
1. Import this repo into Vercel, set the project root to `frontend/`.
2. Set the environment variable `NEXT_PUBLIC_API_URL` to the backend URL from step 3 above.
3. Deploy. Vercel auto-detects Next.js — no extra config needed.

SQLite is file-based; on ephemeral hosts (e.g. Render's free tier) the database
resets on redeploy/restart. This is fine for a demo since the app **automatically
reseeds itself on startup** whenever the forms table is empty.

## Sample data

On first run the backend seeds:
- **Customer Feedback Survey** (published) — short text, email, multiple choice,
  rating, yes/no, long text — with 10 sample responses (including 2 partial ones).
- **Job Application – Frontend Engineer** (published) — short text, email, number,
  dropdown, long text, yes/no — with 7 sample responses (including 1 partial one).
- **Product Launch Event Registration** (draft, unpublished) — demonstrates the
  draft state with no responses yet.
