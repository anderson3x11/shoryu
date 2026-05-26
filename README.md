# Shoryu

Street Fighter 6 stats site. Player profiles, matchup charts, LP/MR history, rankings, and tournament results.

**Live at [shoryu.vercel.app](https://shoryu.vercel.app)**

## Stack

- Next.js 16, TypeScript, Tailwind CSS v4
- shadcn/ui, Recharts
- Data scraped from [Buckler](https://www.streetfighter.com/6/buckler) (Capcom's official SF6 platform)

## Running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file at the root:

```env
BUCKLER_COOKIE=your_buckler_id_cookie_here
```

To get your cookie: log into [streetfighter.com/6/buckler](https://www.streetfighter.com/6/buckler), open DevTools, go to **Application > Cookies > www.streetfighter.com**, and copy the value of `buckler_id`.

> Note: this cookie expires periodically and will need to be refreshed. Without it, player data will return empty.

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

Buckler has no public API. All data is parsed from the `__NEXT_DATA__` JSON embedded in Buckler's page HTML.
