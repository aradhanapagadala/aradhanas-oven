# ✿ aradhana's oven ✿

your cozy cookie space — a one-page, hand-illustrated, very-animated cookie website.

**Stack:** Astro 7 · GSAP 3.15 (ScrollTrigger, SplitText, Draggable, DrawSVG) · Lenis smooth scroll · matter-js physics · self-hosted fonts (Sniglet, Delius, Gaegu) · zero runtime framework.

## run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/ — upload anywhere (Netlify, Vercel, Cloudflare Pages, GitHub Pages)
```

## what's inside

| section | the fun part |
| --- | --- |
| preloader | "preheating the oven …" counts to 350°F, then the curtain drips away (first visit per session) |
| hero | puffy sticker lettering, the "o" in oven is a spinning cookie, stitched ribbon with text gliding along it, stickers that drift with your mouse, an oven mascot whose eyes follow you |
| marquee | two crossed ribbons that speed up and flip direction with your scroll |
| about | scalloped cookie-cutter photo frame, washi tape, chocolate chat bubbles you can drag and fling (they spring home) |
| bake | pinned scroll story: mix → scoop → bake (oven glows, thermometer climbs to 350°) → *ding!* the door swings open and a cookie flies out in a burst of hearts |
| menu | choc chip, brownies, reese’s pb, toffee crunch, chocolate pumpkin swirl — illustrated on gingham plates; tap to take bites (with crumbs) until it's gone and a fresh one pops back; heart your faves |
| be the first to know | live countdown to opening day on little brownie tiles, local-timezone date, “add to my calendar” (.ics with reminder) |
| jar | a real-physics cookie jar — grab & toss on desktop, flick on phones, shake it |
| footer | dripping chocolate edge, night sky, a patch of smiling pumpkins |

Extras: pink native cursor with little labels, sprinkle bursts on every click, optional synthesized sounds (bell button — "ding", "pop", "crunch"), bottom dock nav on phones, full `prefers-reduced-motion` support.

## customize

Everything editable is in **`src/config/site.ts`** (text, flavors, links) and **`src/styles/tokens.css`** (colors). See `CLAUDE.md` — if you open this folder with Claude, just ask in plain words.

Want real cookie photos instead of illustrations? See `FIREFLY_PROMPTS.md`.
