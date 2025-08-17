# Lyra Orrery (Next.js + Tailwind + shadcn/ui + astronomy.ts)

Next.js application that uses `src/lib/astronomy.ts` as the **source of truth** for astronomical data.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Visit <http://localhost:3000> to view the interface. The "Generate real data" button uses shadcn/ui components and calls the `astronomy.ts` file through API routes.

## Verify the API

REST routes are under `/app/api/*`. Example for positions:

```bash
curl "http://localhost:3000/api/positions?lat=-3.7&lon=-38.5"
```

Search helpers include endpoints like:

```bash
curl "http://localhost:3000/api/sunlongitude?targetLon=0&start=2024-03-19"
curl "http://localhost:3000/api/moonphase?targetLon=90&start=2024-03-19"
curl "http://localhost:3000/api/bodydata?bodies=Earth,Mars"
```

## Build

```bash
npm run build
npm start
```

## Tests

```bash
npm test
```

## Publish to GitHub (without Git installed)

- Download this `.tar.gz` or `.zip`.
- Extract it locally.
- **Create an empty repository on GitHub** and copy its URL (e.g., `git@github.com:YOUR_USER/lyra-orrery.git`).

If Git is installed, use the script:

```bash
bash init-git-and-push.sh git@github.com:YOUR_USER/lyra-orrery.git
```
