# The Children's House — Interactive Sales Kit

Tablet-first PWA for sales reps to guide parents through centre tours and open days.

## Stack

- **Next.js 16** (App Router, static generation)
- **shadcn/ui** + **Tailwind CSS v4**
- **Framer Motion** — page transitions, progress nav, carousels
- **Embla Carousel** — photo galleries
- **React Three Fiber** — ambient 3D on location picker
- **Serwist** — PWA / offline support

## Brand colours

| Token | Hex |
|-------|-----|
| Background | `#FFFFFF` |
| Surface | `#F0F4F1` |
| Primary | `#CD2133` |
| Secondary | `#4E738A` |
| Foreground | `#000000` |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in landscape tablet viewport (1280×800 recommended).

## Build & deploy

```bash
npm run build
npm start
```

Deploy to Vercel:

```bash
npx vercel
```

## Journey flow

1. **Location picker** — 15 public centres (KL + Selangor)
2. **Home** — photo carousel + centre intro
3. **Curriculum** — STEAM pillars + Montessori areas
4. **Programmes** — age matcher + Playgroup/Junior cards
5. **Schedule** — interactive daily timeline
6. **Fees** — fee explorer (PDF-sourced) or “discuss on tour” fallback
7. **Register** — multi-step enquiry form (UI only; Supabase later)

## Content

Static JSON in `/content/`:

- `centres.json` — 15 centres
- `curriculum.json` — STEAM + Montessori
- `schedules.json` — daily timeline
- `fees.json` — per-centre fee tables from sales PDF
- `programmes.json` — global programme info

Replace `/public/images/centres/*.svg` with real centre photos when available.

## PWA

- Install via “Add to Home Screen” on tablet
- Service worker precaches app shell in production (`/sw.js`)
- Works offline after first load

## Project structure

```
src/app/                  # Routes
src/components/           # UI components by feature
content/                  # Static content (Supabase-ready schema)
public/                   # Images, icons, manifest
```
