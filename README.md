# School Hearing Accessibility Platform

Next.js + Tailwind + Supabase. Three dashboards: Student, Teacher, Administrator.

## Run it

```
npm install
npm run dev
```

Open http://localhost:3000 — you'll get a role picker linking to /student, /teacher, /admin.

## What actually works right now

Go to /student and click the **Tools** tile. Three things are genuinely functional,
no backend and no API key needed:

- **Live captioning** — real speech-to-text from your mic (Chrome/Edge only)
- **"I missed that"** — grabs the last ~14 words of transcript and saves them
- **Text-to-speech** — reads any text aloud, pick voice + speed

Everything else on screen is mock data.

## Connect Supabase

1. Create a project at supabase.com
2. SQL Editor > New query > paste `supabase/schema.sql` > Run
3. Copy `.env.local.example` to `.env.local`, fill in your URL + anon key
   (Project Settings > API)
4. Restart the dev server

Then swap the blocks marked `// MOCK` in the three page files for real queries.
`lib/supabaseClient.js` has the pattern.

## Build order from here

1. Supabase Auth, gate the three routes behind a real session
2. Swap MOCK data on /student for real queries
3. Same for /teacher and /admin
4. Wire "Log a new issue" to insert into `issues`
5. Wire the meeting calendar to `meetings`
6. Wire "I missed that" to the `flags` table + Supabase Realtime so the teacher sees it
7. Deploy to Vercel
