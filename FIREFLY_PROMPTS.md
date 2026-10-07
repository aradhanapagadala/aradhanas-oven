# Adobe Firefly prompts (optional upgrades)

The site is complete without any of these — every cookie, oven, sticker and pumpkin is hand-built SVG.
Use these when you want real-looking photos to swap in. Keep the style words the same across prompts so everything matches.

**Shared style tail** (append to every prompt):
> soft pastel lavender and pink color palette, dreamy cozy lighting, ultra detailed, high resolution, clean, no text, no logos, no people

---

## 1. Cookie photos for the menu (most impactful)

Generate one per flavor. Settings: **Photo**, aspect **1:1**, then use **Remove background** in Firefly/Express and export a transparent PNG at ~1200×1200.

| file name | prompt |
| --- | --- |
| `og-chunk.png` | top-down studio photo of a single thick bakery chocolate chunk cookie, golden brown crinkled edges, glossy melted dark chocolate puddles, flaky sea salt, centered on plain white |
| `pb-party.png` | top-down studio photo of a single thick peanut butter cookie loaded with orange, yellow and brown candy-coated chocolate pieces and chopped peanut butter cups, centered on plain white |
| `strawberry-cloud.png` | top-down studio photo of a single soft pastel pink strawberry cookie with white chocolate chips and bits of freeze-dried strawberries, centered on plain white |
| `ube-crinkle.png` | top-down studio photo of a single purple ube crinkle cookie with thick cracked powdered sugar coating, fudgy, centered on plain white |
| `toffee-crunch.png` | top-down studio photo of a single dark brown sugar cookie with amber toffee bits and milk chocolate chunks, flaky salt, centered on plain white |
| `pumpkin-hug.png` | top-down studio photo of a single orange pumpkin spice cookie rolled in cinnamon sugar with a white chocolate drizzle zigzag, centered on plain white |

**How to use:** drop the files in `src/assets/cookies/`, then tell Claude:
*"use the photos in src/assets/cookies for the menu cookies"* — it will import them and set `photo:` on each cookie in `src/config/site.ts`.

## 2. Social share image (link previews)

Aspect **16:9** (1200×630), **Art**:
> a cozy kawaii pastel bakery scene at twilight, a cute pink retro oven with a happy face, a plate of chocolate chunk cookies, lavender sky with tiny twinkling stars, pink ribbons, soft 3d clay render style

Save as `public/og.jpg` and ask Claude to add it as the `og:image`.

## 3. Optional texture for the about card

Aspect **1:1**, **Photo**:
> seamless soft cream paper texture with very subtle tiny lavender speckles, flat, evenly lit

Save as `src/assets/paper.jpg` and ask Claude to use it behind the about card.

## Tips

- Generate 4 variations and pick the one with the cleanest round silhouette — it looks best on the plates.
- Keep the camera **top-down** for all cookies so they sit consistently on the plates and in the jar.
- If a cookie looks too dark, add "bright, airy, high-key lighting".
