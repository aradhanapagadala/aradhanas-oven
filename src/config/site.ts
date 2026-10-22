/* ──────────────────────────────────────────────────────────────
   ✿  aradhana's oven — everything you can edit lives here  ✿

   Change any text below, save, and the site updates.
   Colors live in  src/styles/tokens.css
   Cookie looks live in  src/lib/cookie.ts  (the "recipes" below
   pick a look by name, or add a `photo` to use a real picture).
   ────────────────────────────────────────────────────────────── */



import type { ImageMetadata } from 'astro';
import aradhanaPhoto from '../assets/photos/aradhana.jpg';
import browniePhoto from '../assets/photos/brownies.jpg';
import chocChipPhoto from '../assets/photos/chocolate-chip.jpg';
import pumpkinPhoto from '../assets/photos/pumpkin-cookies.jpg';
import reesesPhoto from '../assets/photos/reeses-cookies.jpg';
import toffeePhoto from '../assets/photos/toffee-cookies.jpg';
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
    heading: 'the sweets menu',
    status: 'orders open soon!',
    note: 'small batches, baked fresh. tap a treat to take a bite :)',
  },

  // ▸ your treats. add, remove or reorder freely.
  //   look: chocchip | brownie | reeses | toffee | pumpkinswirl  (see src/lib/cookie.ts)
  cookies: [
    {
      id: 'choc-chip',
      name: 'chocolate chip cookies',
      blurb: 'the classic — golden, buttery edges, a soft gooey middle and lots of chocolate chips.',
      look: 'chocchip',
      photo: chocChipPhoto,
      tags: ['all-year-round!', 'bestseller'],
      tint: '#FFE9C7',
      price: '$2.40 per cookie, $14.50 for a dozen!'
    },
    {
      id: 'brownies',
      name: 'brownies',
      blurb: 'rich, dense and fudgy with that crackly, shiny top. corner piece or middle? you choose.',
      look: 'brownie',
      photo: browniePhoto,
      tags: ['all-year-round!', 'chocolate lover'],
      tint: '#F1DCD0',
      price: '$3.15 per cookie, $19.00 for a dozen!'
    },
    {
      id: 'reeses-pb',
      name: 'reese’s peanut butter cookies',
      blurb: 'soft peanut butter cookies packed with chopped reese’s cups and pieces.',
      look: 'reeses',
      photo: reesesPhoto,
      tags: ['crowd fave', 'seasonal 🎃', 'limited'],
      tint: '#FFE0CC',
      price: '$2.50 per cookie, $15.00 for a dozen!'
    },
    {
      id: 'toffee-crunch',
      name: 'toffee crunch cookies',
      blurb: 'brown sugar dough loaded with buttery toffee bits and chocolate, finished with flaky salt.',
      look: 'toffee',
      photo: toffeePhoto,
      tags: ['seasonal 🎃', 'limited'],
      tint: '#F7E2CF',
      price: '$2.50 per cookie, $15.00 for a dozen!'
    },
    {
      id: 'choc-pumpkin-swirl',
      name: 'chocolate pumpkin swirl cookies',
      blurb: 'spiced pumpkin dough with a ribbon of chocolate swirled through — fall in a cookie.',
      look: 'pumpkinswirl',
      photo: pumpkinPhoto,
      tags: ['seasonal 🎃', 'limited'],
      tint: '#FFDCC4',
      price: '$2.70 per cookie, $16.50 for a dozen!'
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
    text: 'orders open very soon — pop it in your calendar and come grab a warm batch.',
    // ▸ the countdown. set the exact moment orders open (with your timezone offset).
    //   "-04:00" = eastern daylight time, "-05:00" = eastern standard time.
    countdown: {
      opensAt: '2026-11-01T10:00:00-05:00',
      label: 'orders open in',
      openNow: 'orders are open! 🎉',
      remind: 'add to my calendar',
    },
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
