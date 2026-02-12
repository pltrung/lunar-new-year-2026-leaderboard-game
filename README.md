# 🧧 Lunar New Year Dish Championship

A real-time voting leaderboard web app for a private dinner event. Guests vote for their top 2 dishes; votes persist in **Supabase** and the leaderboard updates live. At 9 PM PST on Sunday, voting locks and the top 3 are revealed with a confetti celebration.

## Tech Stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **Framer Motion** (animated leaderboard)
- **Supabase** (Postgres + Realtime + Anonymous Auth)

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account

---

## 1. Clone & Install

```bash
cd "In-Dinner Lunar New Year 2026 Mini game"
npm install
```

---

## 2. Supabase Setup

### 2.1 Create a Supabase project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and sign in
2. **New project** → pick org, name (e.g. "LNY Voting"), database password, region
3. Wait for the project to be ready

### 2.2 Enable Anonymous sign-in

1. In the left sidebar: **Authentication** → **Providers**
2. Find **Anonymous** and turn it **On**
3. Save

### 2.3 Run the database migrations

1. In the left sidebar: **SQL Editor**
2. **New query** → paste the full contents of `supabase/migrations/20260212000000_initial.sql` → **Run**
3. **New query** → paste the contents of `supabase/migrations/20260212200000_add_guest_name.sql` → **Run** (adds guest name to votes)
4. To add dummy dishes in one go: **New query** → paste the contents of `supabase/seed-dishes.sql` → **Run**

### 2.4 Get your API keys

1. **Project Settings** (gear) → **API**
2. Copy **Project URL** and **anon public** (under "Project API keys")

### 2.5 Environment variables

1. Copy the example env file:
   ```bash
   copy .env.local.example .env.local
   ```
2. In `.env.local`, set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2.6 Seed the dishes table (if you didn’t in 2.3)

Add your dishes so they appear in the app. Each dish needs an `id` (UUID), `name`, and `votes` (0).

**Quick option:** Run `supabase/seed-dishes.sql` in the SQL Editor (see step 2.3).

**Option A – Table Editor**

1. **Table Editor** → **dishes** → **Insert row**
2. Add rows with:
   - `name`: e.g. "Dumplings"
   - `votes`: 0  
   (Leave `id` blank to auto-generate a UUID.)

**Option B – SQL**

Run in **SQL Editor** (replace names with your list):

```sql
insert into public.dishes (name, votes) values
  ('Spring Rolls', 0),
  ('Dumplings', 0),
  ('Fish (Nián Nián Yǒu Yú)', 0),
  ('Nian Gao', 0),
  ('Longevity Noodles', 0),
  ('Buddha''s Delight', 0),
  ('Tangyuan', 0),
  ('Turnip Cake', 0),
  ('Eight Treasure Rice', 0),
  ('Hot Pot', 0),
  ('Rice Cakes', 0),
  ('Sweet Rice Balls', 0);
```

You can use the list in `src/lib/constants.ts` (`DEFAULT_DISHES`) or run `node scripts/seed-dishes.js` to print names.

---

## 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the countdown, leaderboard, and voting section. Sign-in is anonymous and automatic.

---

## 4. Deploy (Vercel)

### 4.1 Push to GitHub

```bash
git init
git add .
git commit -m "Lunar New Year voting app"
git remote add origin https://github.com/YOUR_USERNAME/lunar-voting.git
git push -u origin main
```

### 4.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. **Add New** → **Project** → Import your GitHub repo
3. **Environment Variables**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same as `.env.local`)
4. Deploy

Your app will be live at `https://your-project.vercel.app`.

### 4.3 (Optional) Custom domain

In the Vercel project → **Settings** → **Domains**, add your domain and follow the DNS steps.

---

## Data structure (Supabase)

| Table    | Columns |
|----------|---------|
| `dishes` | `id` (uuid), `name` (text), `votes` (int) |
| `votes`  | `id`, `user_id` (uuid, ref auth.users), `selected` (uuid[2]), `created_at` |

- One vote per user: `votes.user_id` is unique; duplicate inserts are rejected.
- When a row is inserted into `votes`, a trigger increments `votes` on the two selected dishes.

---

## Timer and lock

- Countdown targets **Sunday 9:00 PM PST** (see `VOTING_END_DATE` in `src/lib/constants.ts`).
- Default is **Feb 15, 2026**. Change it in `src/lib/constants.ts` for your event.
- When the countdown reaches zero, voting is disabled and “Voting Closed! Winners Announced!” plus confetti are shown.

---

## Folder structure

```
In-Dinner Lunar New Year 2026 Mini game/
├── .env.local.example
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── supabase/
│   └── migrations/
│       └── 20260212000000_initial.sql
├── scripts/
│   └── seed-dishes.js
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── CountdownTimer.tsx
    │   ├── Leaderboard.tsx
    │   ├── VotingSection.tsx
    │   ├── StatusBadge.tsx
    │   ├── ParticipationCount.tsx
    │   └── Confetti.tsx
    ├── hooks/
    │   ├── useCountdown.ts
    │   ├── useDishes.ts
    │   ├── useUserVoteStatus.ts
    │   └── useVotesCount.ts
    ├── lib/
    │   ├── supabase.ts
    │   ├── constants.ts
    │   └── vote.ts
    └── types/
        └── index.ts
```

---

## Security summary

- **Anonymous Auth** only; no personal data.
- **RLS**: anyone can read `dishes`; users can read/insert only their own row in `votes`; no client updates to `dishes` (only the trigger updates vote counts).
- **Duplicate votes**: prevented by unique `user_id` on `votes` and RLS.

---

## Customization

- **Dishes:** Edit `DEFAULT_DISHES` in `src/lib/constants.ts` and add rows in Supabase (Table Editor or SQL).
- **Guest count:** Update `TOTAL_GUESTS` in `src/lib/constants.ts` (used for “X / 14 Guests Voted”).
- **Voting end time:** Update `VOTING_END_DATE` in `src/lib/constants.ts` (e.g. `new Date("2026-02-15T21:00:00-08:00")` for 9 PM PST).

Enjoy the dinner and the championship. 🐎🧧
