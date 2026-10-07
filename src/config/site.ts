/* ──────────────────────────────────────────────────────────────
   ✿  aradhana's oven — everything you can edit lives here  ✿

   Change any text below, save, and the site updates.
   Colors live in  src/styles/tokens.css
   Cookie looks live in  src/lib/cookie.ts  (the "recipes" below
   pick a look by name, or add a `photo` to use a real picture).
   ────────────────────────────────────────────────────────────── */

import type { ImageMetadata } from 'astro';
import aradhanaPhoto from '../assets/photos/aradhana.jpg';
import type { CookieLook } from '../lib/cookie';

export type Cookie = {
  id: string;
  name: string;
  blurb: string;
  look: CookieLook; // the illustrated version (see src/lib/cookie.ts)
  photo?: ImageMetadata; // optional: import a Firefly photo and put it here
  tags: string[];
  tint: string; // card background tint
  price?: string; // leave empty while orders are closed
};

export const site = {
  name: "aradhana's oven",
  title: "aradhana's oven — your cozy cookie space",
  description:
    'small-batch, baked-with-love cookies by aradhana. because sweet things heal a lot of wounds — and they are best when shared.',
  url: 'https://sathwiksang.github.io/aradhanas-oven/',

  hero: {
    hello: 'welcome to …',
    tagline: 'your cozy cookie space',
    sub: 'small batches · big hugs · always warm',
    scrollHint: 'scroll for something sweet',
  },

  marquee: [
    'fresh out the oven',
    'sweet things heal',
    'baked with love',
    'best when shared',
    'small batch magic',
    'warm hugs inside',
  ],

  about: {
    kicker: 'the baker',
    heading: 'hi, i’m aradhana!',
    photo: aradhanaPhoto,
    photoAlt: 'aradhana smiling and holding a green smoothie',
    photoCaption: 'me, probably thinking about cookies',
    // each line pops up like a little chat bubble
    bubbles: [
      'my name is aradhana, and i am so happy you’re here!',
      'this space is for those who need a little pick me up …',
      'because i believe that sweet things heal a lot of wounds!',
      'and those sweets are the best when they are shared <3',
    ],
    signoff: 'xoxo, aradhana',
  },

  bake: {
    kicker: 'how a batch is born',
    heading: 'from my bowl to your hands',
    steps: [
      { title: 'mix with love', text: 'real butter, brown sugar and a little too much chocolate. stirred by hand, always.' },
      { title: 'scoop it big', text: 'chunky dough balls, rested overnight so every bite gets that toffee-ish depth.' },
      { title: 'bake till golden', text: 'crispy edges, gooey middles. i watch the oven like it’s a movie.' },
      { title: 'share the sweetness', text: 'wrapped up warm and handed to you — the best part of the whole recipe.' },
    ],
    done: 'ding!',
  },

  menu: {
    kicker: 'ordering & menu <3',
    heading: 'the cookie menu',
    status: 'orders open soon!',
    note: 'flavors rotate with the seasons. tap a cookie to take a bite :)',
  },

  // ▸ your flavors. add, remove or reorder freely.
  cookies: [
    {
      id: 'og-chunk',
      name: 'the og chunk',
      blurb: 'brown butter dough, puddles of dark chocolate, a pinch of flaky salt.',
      look: 'classic',
      tags: ['bestseller', 'gooey'],
      tint: '#FFE9C7',
    },
    {
      id: 'pb-party',
      name: 'pb cup party',
      blurb: 'peanut butter dough loaded with candy pieces and chopped pb cups.',
      look: 'peanut',
      tags: ['crowd fave'],
      tint: '#FFE0CC',
    },
    {
      id: 'strawberry-cloud',
      name: 'strawberry milk cloud',
      blurb: 'soft pink strawberry dough, white chocolate chips, freeze-dried berries.',
      look: 'strawberry',
      tags: ['new', 'pretty in pink'],
      tint: '#FFD9EB',
    },
    {
      id: 'ube-crinkle',
      name: 'ube crinkle dream',
      blurb: 'purple yam crinkle, fudgy center, snowy powdered sugar coat.',
      look: 'ube',
      tags: ['fudgy'],
      tint: '#E7DCFF',
    },
    {
      id: 'toffee-crunch',
      name: 'salted toffee crunch',
      blurb: 'dark brown sugar dough, buttery toffee bits, milk chocolate chunks.',
      look: 'toffee',
      tags: ['crunchy edges'],
      tint: '#F7E2CF',
    },
    {
      id: 'pumpkin-hug',
      name: 'pumpkin spice hug',
      blurb: 'warm pumpkin dough rolled in cinnamon sugar, white chocolate drizzle.',
      look: 'pumpkin',
      tags: ['seasonal 🎃', 'limited'],
      tint: '#FFDCC4',
    },
  ] satisfies Cookie[],

  jar: {
    kicker: 'while you wait …',
    heading: 'play with the cookie jar',
    hintMouse: 'grab & toss the cookies · click to add more',
    hintTouch: 'tap a cookie to flick it · tap empty space to add one',
    shake: 'shake it!',
    reset: 'empty jar',
  },

  order: {
    heading: 'be the first to know',
    text: 'orders open very soon. send me a message and i’ll save you a warm batch.',
    // ▸ put your real links here
    primary: { label: 'dm me on instagram', href: 'https://instagram.com/' },
    secondary: { label: 'send an email', href: 'mailto:hello@aradhanasoven.com' },
  },

  footer: {
    big: 'sweet things heal.',
    big2: 'share them.',
    small: 'baked with love & a lot of butter',
    links: [
      { label: 'instagram', href: 'https://instagram.com/' },
      { label: 'email', href: 'mailto:hello@aradhanasoven.com' },
    ],
  },

  nav: [
    { id: 'home', label: 'home' },
    { id: 'about', label: 'about' },
    { id: 'bake', label: 'bake' },
    { id: 'menu', label: 'menu' },
    { id: 'jar', label: 'jar' },
  ],
};
