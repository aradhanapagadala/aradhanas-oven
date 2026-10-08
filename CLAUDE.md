# aradhana's oven — notes for Claude

A single-page Astro site for Aradhana's small-batch cookie business. Lavender/pink/chocolate, kawaii-sticker style, lots of playful motion. The owner is not a developer — she will ask in plain words ("make the pink softer", "add a lemon cookie"). Keep the voice lowercase, warm and cute.

## Where things live

| want to change… | edit |
| --- | --- |
| any text (hero, about bubbles, steps, menu, links, footer) | `src/config/site.ts` |
| colors / fonts | `src/styles/tokens.css` (all components read these variables) |
| cookie flavors on the menu | `site.cookies` in `src/config/site.ts` |
| how an illustrated cookie looks | `RECIPES` in `src/lib/cookie.ts` |
| her photo | replace `src/assets/photos/aradhana.jpg` (keep portrait ~3:4) |
| instagram / email links | `site.order` and `site.footer.links` in `src/config/site.ts` |
| motion / interactions | `src/scripts/main.ts` (GSAP + Lenis), `src/scripts/jar.ts` (matter-js) |

Sections are components in `src/components/` and are ordered in `src/pages/index.astro`.

## Common requests

- **Add a treat**: add an object to `site.cookies` with `look` set to one of `chocchip | brownie | reeses | toffee | pumpkinswirl` (older extra looks: `classic | peanut | strawberry | ube | pumpkin`). The menu, marquee and cookie jar all follow `site.cookies` automatically; `brownie` renders as a square everywhere. For a brand-new look, add a recipe to `RECIPES` in `src/lib/cookie.ts` (dough colors + toppings) and add its key to the `CookieLook` type.
- **Use a real photo for a cookie**: put a transparent PNG/WebP in `src/assets/cookies/`, import it at the top of `site.ts`, and set `photo: thatImport` on the cookie. The card uses it instead of the illustration.
- **Countdown**: set `site.order.countdown.opensAt` to an ISO time with timezone offset (e.g. `2026-11-01T10:00:00-05:00` = 10am eastern standard). When it hits zero the tiles turn into the `openNow` message. Visitors see the time in their own timezone, and "add to my calendar" downloads an .ics with a 30-min reminder.
- **Open orders / show prices**: set `price: '$3'` on each cookie, and change `site.menu.status` (e.g. `'orders are open!'`).
- **Change the palette**: edit `--pink-*`, `--lav-*`, `--choco-*` in `tokens.css`. Keep text contrast readable (chocolate on cream/lavender, cream on chocolate/plum).

## Commands

```bash
npm install      # first time only
npm run dev      # live preview at http://localhost:4321
npm run build    # production build into dist/
npm run preview  # serve the built site
```

## Rules of the house

- Keep the native pointer usable: cursors are styled with CSS `cursor:` images (no hidden cursor, no lagging followers). `data-cursor="text"` shows a small label next to it.
- Respect `prefers-reduced-motion` — every new animation must be skipped/simplified when `html.reduced` is set.
- Keep it one page. Use the existing sticker / puffy-text / chunky-border language (3px chocolate borders, solid drop shadows, rounded everything).
- Do not use copyrighted characters (e.g. Snoopy) or brand logos in artwork.
- Images go through `astro:assets` (`<Image />`) so they're optimized automatically.
- Check desktop (1440px) and phone (390px) after visual changes; the phone layout uses a bottom nav dock.
