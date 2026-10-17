/* ---- new-c: Athic marketing content (the Athic marketing site: Perspectives, podcasts, mission, legal, contact) ---- */
/**
 * Sample content for the marketing constructs: Athic, an independent daily Catholic practice app (readings, the Rosary, a
 * private journal, and Ask, answers grounded in the Catechism). Used by HeroSplit, Section, PageHeader, Prose, FilterBar,
 * ScrollRail, Form and useHashTarget examples. Art is generated here as data URIs so no image files are needed.
 */

export const ATHIC_PITCH = "Daily practice plus a catechist in your pocket.";
export const ATHIC_SUB = "Readings, the Rosary, a private journal and Ask, grounded in the Catechism.";
export const ATHIC_LEGAL = "Independent, not an official Church product.";

export interface ArtPalette {
  top: string;
  mid: string;
  warm: string;
  sun: string;
}
export const ART_NAVY: ArtPalette = { top: "#0a0b16", mid: "#1d2040", warm: "#c4402a", sun: "#e9705c" };
export const ART_CRIMSON: ArtPalette = { top: "#2a0f1c", mid: "#5a1f2b", warm: "#e9705c", sun: "#f2a07a" };
export const ART_BLUE: ArtPalette = { top: "#0a1030", mid: "#1f3a8a", warm: "#e9705c", sun: "#6181cf" };
export const ART_OLIVE: ArtPalette = { top: "#10131a", mid: "#2d3a2a", warm: "#c4402a", sun: "#d9b35c" };

export type ArtKind = "dusk" | "books" | "hills";

/**
 * A dusk-sky illustration (a church and two figures, a wall of books, or hills) as an `image/svg+xml` data URI, for
 * `HeroSplit backdrop`, `PageHeader cover` and card covers.
 */
export function athicArt(kind: ArtKind = "dusk", p: ArtPalette = ART_NAVY): string {
  const dark = "#070813";
  let shapes = "";
  if (kind === "dusk") {
    shapes =
      `<path d="M0 410 Q200 385 400 405 T800 395 V500 H0Z" fill="${dark}"/><rect x="590" y="300" width="120" height="112" fill="${dark}"/>` +
      `<polygon points="582,300 650,252 718,300" fill="${dark}"/><rect x="630" y="214" width="40" height="90" fill="${dark}"/>` +
      `<polygon points="626,214 650,182 674,214" fill="${dark}"/><rect x="648" y="150" width="4" height="34" fill="${dark}"/>` +
      `<rect x="640" y="160" width="20" height="4" fill="${dark}"/><rect x="612" y="330" width="14" height="26" rx="7" fill="${p.sun}"/>` +
      `<rect x="674" y="330" width="14" height="26" rx="7" fill="${p.sun}"/><circle cx="470" cy="350" r="10" fill="${dark}"/>` +
      `<rect x="458" y="360" width="24" height="64" rx="10" fill="${dark}"/><circle cx="505" cy="360" r="8" fill="${dark}"/>` +
      `<rect x="496" y="368" width="19" height="52" rx="8" fill="${dark}"/>`;
  } else if (kind === "books") {
    const heights = [190, 240, 170, 260, 210, 150, 250, 200, 180, 230, 160, 245, 205, 175, 255, 195, 220, 165, 235, 185, 215, 170];
    const fills = [dark, "#12152e", "#1e2347"];
    shapes = heights
      .map((h, k) => `<rect x="${k * 37 + 4}" y="${500 - h}" width="33" height="${h}" fill="${fills[k % 3]}"/>`)
      .join("");
    shapes += `<rect x="676" y="250" width="56" height="250" rx="10" fill="${dark}"/><rect x="694" y="190" width="20" height="70" fill="${dark}"/>`;
  } else {
    shapes =
      `<path d="M0 340 Q180 270 360 330 T800 300 V500 H0Z" fill="#14173a" opacity=".9"/>` +
      `<path d="M0 400 Q220 340 420 395 T800 370 V500 H0Z" fill="${dark}"/><circle cx="130" cy="300" r="36" fill="#0a0b16"/>` +
      `<rect x="127" y="330" width="6" height="60" fill="#0a0b16"/>`;
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"><defs>` +
    `<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.top}"/><stop offset=".6" stop-color="${p.mid}"/>` +
    `<stop offset="1" stop-color="${p.warm}" stop-opacity=".55"/></linearGradient>` +
    `<radialGradient id="s"><stop offset="0" stop-color="${p.sun}" stop-opacity=".95"/><stop offset=".45" stop-color="${p.sun}" stop-opacity=".35"/>` +
    `<stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient></defs>` +
    `<rect width="800" height="500" fill="url(#b)"/><circle cx="600" cy="210" r="190" fill="url(#s)"/>${shapes}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface Perspective {
  id: string;
  category: "Ethics" | "Dialogues" | "Grace" | "Letters";
  title: string;
  excerpt: string;
  readMinutes: number;
  date: string;
  art: ArtKind;
  palette: ArtPalette;
  /** Index into the theme's four tints, for the category tag. */
  tint: 1 | 2 | 3 | 4;
}

export const PERSPECTIVES: Perspective[] = [
  { id: "harvest", category: "Ethics", title: "To Be Sorted At The Harvest", excerpt: "What the parable of the wheat and the weeds asks of us now.", readMinutes: 6, date: "12 Oct", art: "hills", palette: ART_BLUE, tint: 1 },
  { id: "motherhood", category: "Dialogues", title: "Motherhood", excerpt: "A conversation about a mother, a doubt and a lighted window.", readMinutes: 4, date: "9 Oct", art: "dusk", palette: ART_CRIMSON, tint: 3 },
  { id: "fire", category: "Grace", title: "The Fire That Cleanses", excerpt: "Why the purifying fire is mercy before it is judgment.", readMinutes: 8, date: "2 Oct", art: "dusk", palette: ART_NAVY, tint: 4 },
  { id: "fruit", category: "Ethics", title: "Illusive Fruit", excerpt: "Fruit that looks ripe and is not: a short reflection.", readMinutes: 3, date: "25 Sep", art: "hills", palette: ART_OLIVE, tint: 1 },
  { id: "conscience", category: "Letters", title: "On the Perils of Conscience", excerpt: "A letter on examining conscience without scrupulosity.", readMinutes: 7, date: "18 Sep", art: "books", palette: ART_NAVY, tint: 2 },
  { id: "rosary", category: "Grace", title: "What the Rosary Teaches the Hurried", excerpt: "Ten decades, slowly. A practice for the hurried.", readMinutes: 5, date: "11 Sep", art: "books", palette: ART_CRIMSON, tint: 4 },
];
export const perspectiveArt = (p: Perspective) => athicArt(p.art, p.palette);

export const PERSPECTIVE_CATEGORIES = [
  { value: "all", label: "All", count: 24 },
  { value: "Ethics", label: "Ethics", count: 9 },
  { value: "Dialogues", label: "Dialogues", count: 5 },
  { value: "Grace", label: "Grace", count: 6 },
  { value: "Letters", label: "Letters", count: 4 },
];
export const PERSPECTIVE_SORT = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "shortest", label: "Shortest read" },
];

export interface Podcast {
  id: string;
  title: string;
  blurb: string;
  art: ArtKind;
  palette: ArtPalette;
}
export const PODCASTS: Podcast[] = [
  { id: "athic", title: "The Athic Podcast", blurb: "Conversations on the daily practice of the Faith.", art: "books", palette: ART_NAVY },
  { id: "aloud", title: "Perspectives, read aloud", blurb: "Each essay, narrated. New every Friday.", art: "dusk", palette: ART_CRIMSON },
];

export const HOME_CARDS = [
  { id: "readings", title: "Today’s readings", body: "Laid out to read straight through.", tint: 1 },
  { id: "prayers", title: "Prayers you can listen to", body: "The Rosary, with narration.", tint: 2 },
  { id: "year", title: "A record of your year", body: "Private, not a scorecard.", tint: 3 },
] as const;

/** Home screen of the app, shown in the phone slot of the hero. */
export const APP_TODAY = {
  heading: "Saturday, 27th Week in Ordinary Time",
  readings: { title: "Today’s Mass readings", detail: "Galatians 3:22–29 · Luke 11:27–28", action: "Read today’s Mass" },
  checkIn: { title: "Did you attend Mass today?", action: "Check in" },
  ask: { title: "Questions about the Faith, answered from the Catechism.", action: "Start a conversation" },
};
export const HERO_CHIPS = [
  { id: "ccc", side: "end" as const, top: "10%", label: "Ask", content: "CCC 1374 The mode of Christ’s presence…" },
  { id: "mass", side: "start" as const, top: "70%", label: "Today", content: "Luke 11:27–28 · Checked in" },
];

export const MISSION_COPY = {
  eyebrow: "Mission",
  title: "A catechist you can always ask.",
  lede: "Athic is an independent project for people who practise the Faith every day.",
};

/** The Transparency page: one accordion row per topic, with the id its hash link targets. */
export const TRANSPARENCY = [
  { id: "model", title: "The model", body: "The model is Qwen, from Alibaba Cloud. Athic does not train it on your conversations. It runs in Singapore." },
  { id: "journal", title: "Your journal", body: "Encrypted on your device with a passphrase only you know. We only ever hold ciphertext, so we cannot read it or recover it." },
  { id: "data", title: "Your data", body: "Your email address, the Masses you mark as attended, and your questions to Ask. Export or delete all of it from Your Account." },
  { id: "regions", title: "Where it runs", body: "Ask replies are generated in Singapore. Accounts and sync run in the United States." },
  { id: "age", title: "Children and age", body: "Athic is for people aged 13 and over. We do not knowingly collect data from younger children." },
];

/** A Perspective article body, as Markdown. */
export const ARTICLE_MARKDOWN = `The servants ask the master whether they should pull up the weeds. **He says no**, because in gathering the weeds they would uproot the wheat with them.

It is a hard word for anyone who would like the Church, or themselves, sorted cleanly and soon.

> Let both grow together until the harvest.
> — Matthew 13:30

Two things follow. First, [patience is not indifference](/perspectives/harvest#patience). Second, the sorting is not ours to do.

### A practice for this week

1. Name one thing you are tempted to pull up early.
2. Pray the Examen once, slowly.`;

/** The privacy summary, as Markdown (headings, lists, a quote with cite, a table, an ordered list, code). */
export const PRIVACY_MARKDOWN = `## Your journal

The reconciliation journal is encrypted on your device with a passphrase only you know. We only ever hold ciphertext, so we [cannot read it or recover it](/privacy#journal). If you forget the passphrase, the entries are gone.

### What we keep

- Your email address, to sign you in.
- The Masses you mark as attended, as a private year view.
- Your questions to Ask, so a conversation can continue.

> "Whose sins you shall forgive, they are forgiven them."
> — John 20:23

### Where it runs

| Region | Used for | Provider |
| --- | --- | --- |
| Singapore | Ask replies | Alibaba Cloud |
| United States | Accounts and sync | Google Cloud |

### Delete everything

1. Open **Your Account**.
2. Choose **Export** or **Delete my data**.
3. Confirm with your passphrase.

Exports arrive as a \`.zip\` within a minute. Questions? [Write to us](/contact).`;

export const CONTACT_TOPICS = ["General question", "A correction", "Press and speaking", "Privacy and data"];
export const CONTACT_ASIDE = [
  { id: "time", kicker: "Response time", body: "Within two working days.", tint: 1 },
  { id: "press", kicker: "Press and speaking", body: "See Workshops, or write to the same address.", tint: 3 },
];
