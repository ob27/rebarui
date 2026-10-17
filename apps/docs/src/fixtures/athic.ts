/**
 * Athic: the sample world for the phone constructs (TopBar, List, SearchInput, Textarea, toast, confirm and friends). A Catholic
 * question-and-answer app: discussions you have asked, daily Mass readings, a Library of articles, plans and a profile. Use
 * this instead of inventing data inline. Append only: other constructs add their own blocks at the end, under a `// ---- new-X ----` header.
 */

// ---- new-a: mobile structure ----

/** Soft gradients standing in for cover art and thumbnails (tokens only, so they follow light and dark). */
export const ART: string[] = [
  "linear-gradient(135deg, var(--rebar-color-tint-1), var(--rebar-color-tint-3))",
  "linear-gradient(135deg, var(--rebar-color-tint-2), var(--rebar-color-tint-1))",
  "linear-gradient(135deg, var(--rebar-color-tint-3), var(--rebar-color-tint-4))",
  "linear-gradient(135deg, var(--rebar-color-tint-4), var(--rebar-color-tint-2))",
  "linear-gradient(135deg, var(--rebar-color-tint-1), var(--rebar-color-tint-4))",
];

export interface Discussion {
  id: string;
  title: string;
  when: string;
  /** Index into `ART`. */
  art: number;
}

export const DISCUSSIONS: Discussion[] = [
  { id: "confession", title: "Why do Catholics confess to a priest?", when: "2 hours ago", art: 0 },
  { id: "sick", title: "Is it a sin to miss Mass when I am sick, or when I am up all night caring for a newborn?", when: "Yesterday", art: 1 },
  { id: "gospel", title: "Explain today’s Gospel", when: "3 days ago", art: 2 },
  { id: "silent", title: "How should I pray when God feels completely silent and nothing seems to help?", when: "Last week", art: 3 },
  { id: "mary", title: "Is Mary really sinless? Where is that in Scripture?", when: "Just now", art: 4 },
];
export const discussion = (id: string): Discussion => DISCUSSIONS.find((d) => d.id === id) ?? DISCUSSIONS[0];

export const QUESTION = "Why do we confess our sins to a priest and not straight to God?";
export const ANSWER =
  "Because Jesus gave the Apostles that very ministry. After the Resurrection he told them, “Whose sins you shall forgive, they are forgiven them” (John 20:23).";

export const TODAY = {
  date: "Friday 24 October",
  saint: "Saint Raphael the Archangel",
  gospel: "Luke 12:1-7",
  gospelLine: "Nothing is hidden that will not be revealed. Even the hairs of your head are all counted.",
  readingsLine: "First reading, Gospel and a short reflection. About six minutes.",
  attendance: "3 of 4 Sundays this month",
  attendanceLine: "Your last Mass was 19 October.",
};

export const PERSPECTIVE = {
  kicker: "Perspective",
  title: "Why Catholics honour Mary",
  body: "Four short readings from the Fathers of the Church on the Mother of God.",
};

export const ARTICLE = {
  kicker: "Narrated by an Athic author",
  title: "Confession to a priest",
  body: "Catholics confess to a priest because Jesus gave his Apostles the ministry of reconciliation. “Whose sins you shall forgive, they are forgiven them” (John 20:23).",
};

export interface Plan {
  id: string;
  name: string;
  price: string;
  tokens: string;
  art: number;
}
export const PLANS: Plan[] = [
  { id: "free", name: "Free", price: "Free", tokens: "200,000 tokens a month", art: 3 },
  { id: "plus", name: "Plus", price: "$10 per month", tokens: "2,000,000 tokens", art: 1 },
  { id: "standard", name: "Standard", price: "$20 per month", tokens: "4,000,000 tokens", art: 0 },
];
export const CURRENT_PLAN = "plus";

export const PROFILE = { name: "Maria K", username: "@maria_k", email: "maria@example.com", initials: "MK" };
export const BIBLE_TRANSLATIONS = [
  { value: "dr", label: "Douay-Rheims (default)" },
  { value: "cpdv", label: "Catholic Public Domain Version (CPDV)" },
];

export const LIBRARY_ENTRIES = [
  { id: "discussions", label: "Discussions", detail: "14 saved", tone: 1 as const },
  { id: "topics", label: "Topics", detail: "3 topics", tone: 2 as const },
  { id: "perspectives", label: "Perspectives", detail: "New this week", tone: 3 as const },
  { id: "listen", label: "Listen", detail: "No recordings yet", tone: 4 as const },
];

export const REFLECTION_PLACEHOLDER = "What stayed with you from today’s Gospel?";
export const REFLECTION =
  "Peter asked for faith. The widow only asked again. I keep dropping my evening prayer when I am tired; today I will ask once more, even for two minutes.";
export const FEEDBACK_PLACEHOLDER = "What would you like to tell us?";
 * Athic: sample content for the mobile Athic constructs (a Catholic companion app): Scripture, Mass readings, a catechist chat,
 * covers, onboarding slides and a year of Mass attendance. Texts are public domain (Douay-Rheims, Challoner revision).
 * Append only: other construct groups add their own sections below.
 */
/* ---- new-b: mobile features (AuthScreen, ImagePicker, ReadingView, Onboarding, player, chat, dates) ---- */

export type AthicArtKind = "cross" | "dove" | "book" | "chalice" | "flame" | "rosary" | "sun" | "candle";

const ART: Record<AthicArtKind, { a: string; b: string; shapes: string }> = {
  cross: { a: "#1d2040", b: "#3d5fb4", shapes: '<path d="M0 78Q30 62 55 72T100 66V100H0z" fill="#0a0b16"/><rect x="46" y="26" width="8" height="46" fill="#e9705c"/><rect x="36" y="38" width="28" height="7" fill="#e9705c"/>' },
  dove: { a: "#3d5fb4", b: "#e9705c", shapes: '<ellipse cx="50" cy="52" rx="20" ry="11" fill="#fbf6ee"/><path d="M50 50Q38 22 22 28Q36 38 44 54z" fill="#fbf6ee"/><circle cx="68" cy="46" r="7" fill="#fbf6ee"/>' },
  book: { a: "#0a0b16", b: "#1d2040", shapes: '<path d="M50 34Q30 26 12 32V72Q30 66 50 76z" fill="#e9705c"/><path d="M50 34Q70 26 88 32V72Q70 66 50 76z" fill="#fbf6ee"/>' },
  chalice: { a: "#e9705c", b: "#1d2040", shapes: '<path d="M34 28H66Q66 52 50 54Q34 52 34 28z" fill="#fbf6ee"/><rect x="47" y="54" width="6" height="16" fill="#fbf6ee"/><ellipse cx="50" cy="74" rx="16" ry="5" fill="#fbf6ee"/>' },
  flame: { a: "#0a0b16", b: "#5b2431", shapes: '<path d="M50 20Q70 46 64 64Q60 78 50 78Q38 78 36 64Q34 52 46 42Q46 32 50 20z" fill="#e9705c"/>' },
  rosary: { a: "#3d5fb4", b: "#1d2040", shapes: '<g fill="#fbf6ee"><circle cx="76" cy="44" r="4"/><circle cx="70" cy="58" r="4"/><circle cx="56" cy="66" r="4"/><circle cx="44" cy="66" r="4"/><circle cx="30" cy="58" r="4"/><circle cx="24" cy="44" r="4"/><circle cx="30" cy="30" r="4"/><circle cx="44" cy="22" r="4"/><circle cx="56" cy="22" r="4"/><circle cx="70" cy="30" r="4"/></g><rect x="48" y="68" width="4" height="18" fill="#e9705c"/>' },
  sun: { a: "#e9705c", b: "#3d5fb4", shapes: '<circle cx="50" cy="52" r="18" fill="#fbf6ee"/>' },
  candle: { a: "#1d2040", b: "#5b2431", shapes: '<rect x="44" y="44" width="12" height="38" rx="2" fill="#fbf6ee"/><path d="M50 22Q58 32 54 40Q50 44 46 40Q44 32 50 22z" fill="#e9705c"/>' },
};

/** A small illustrated cover as an inline SVG data URI, so the examples need no image files. `thumb` is a 12px-wide version for blur-up. */
export function athicArt(kind: AthicArtKind, thumb = false): string {
  const { a, b, shapes } = ART[kind];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"${thumb ? ' width="12" height="12"' : ""}><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/>${shapes}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface AthicCover {
  id: string;
  src: string;
  thumbSrc: string;
  alt: string;
  tags: string[];
}

const COVER_DEFS: [AthicArtKind, string, string[]][] = [
  ["cross", "Cross at dusk", ["Scripture", "Liturgy"]],
  ["dove", "Dove in flight", ["Scripture"]],
  ["book", "Open Gospel", ["Scripture"]],
  ["chalice", "Chalice", ["Liturgy"]],
  ["flame", "Pentecost flame", ["Scripture", "Liturgy"]],
  ["rosary", "Rosary beads", ["Saints"]],
  ["sun", "Sunrise", ["Nature"]],
  ["candle", "Votive candle", ["Liturgy", "Saints"]],
];

/** Covers for the discussion-cover picker. */
export const COVERS: AthicCover[] = COVER_DEFS.map(([kind, alt, tags], i) => ({ id: `cover-${i + 1}`, src: athicArt(kind), thumbSrc: athicArt(kind, true), alt, tags }));
export const COVER_TAGS = ["Scripture", "Saints", "Liturgy", "Nature"];

/** App icon variants for the icon picker (each is a cover-style tile; the real icons are app code). */
export const APP_ICONS: AthicCover[] = (["flame", "sun", "cross", "candle", "dove", "rosary"] as AthicArtKind[]).map((kind, i) => ({
  id: `icon-${i + 1}`,
  src: athicArt(kind),
  thumbSrc: athicArt(kind, true),
  alt: `App icon ${i + 1}`,
  tags: [],
}));

/** Galatians 3 (Douay-Rheims, Challoner revision), the first verses. */
export const GALATIANS_3 = [
  { num: 1, text: "O senseless Galatians, who hath bewitched you that you should not obey the truth, before whose eyes Jesus Christ hath been set forth, crucified among you?" },
  { num: 2, text: "This only would I learn of you: Did you receive the Spirit by the works of the law, or by the hearing of the faith?" },
  { num: 3, text: "Are you so foolish, that, whereas you began in the spirit, you would now be made perfect by the flesh?" },
  { num: 4, text: "Have you suffered so great things in vain? If it be yet in vain." },
];

export const MASS_DAY = "Saturday, 27th Week in Ordinary Time";
export const MASS_FIRST_READING_CITATION = "First reading · Galatians 3:22-29";
export const MASS_FIRST_READING =
  "But the scripture hath concluded all under sin, that the promise, by the faith of Jesus Christ, might be given to them that believe. But before the faith came, we were kept under the law shut up, unto that faith which was to be revealed. Wherefore the law was our pedagogue in Christ, that we might be justified by faith.";
export const BIBLE_CREDIT = "Douay-Rheims translation (Challoner Revision).";

export interface AthicSlide {
  title: string;
  description: string;
  tint: "tint-1" | "tint-2" | "tint-3" | "tint-4";
  note?: string;
}
export const ONBOARDING_SLIDES: AthicSlide[] = [
  { title: "Today’s readings", description: "Open Athic each day to the Mass readings, with a one-tap check-in when you’ve been to Mass.", tint: "tint-1" },
  { title: "Ask about the faith", description: "Questions answered from the Catechism and Scripture, with the sources shown.", tint: "tint-3" },
  { title: "A private journal", description: "Your Reconciliation Journal is encrypted on this device. Only you can read it.", tint: "tint-2" },
  { title: "Pray with the Rosary", description: "Pray bead by bead, and find other prayers with audio and text.", tint: "tint-4", note: "Independent, not an official Church product" },
];

export interface AthicWeek {
  date: string;
  value: number;
  label: string;
}
const WEEK_PATTERN = [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1];
/** The past 52 weeks of Mass attendance, Mondays from 6 Oct 2025 to 5 Oct 2026. Deterministic. */
export const ATTENDANCE_WEEKS: AthicWeek[] = WEEK_PATTERN.map((value, i) => {
  const d = new Date(Date.UTC(2025, 9, 6 + i * 7));
  const date = d.toISOString().slice(0, 10);
  const pretty = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  return { date, value, label: `Week of ${pretty}${value ? ", attended Mass" : ""}` };
});

export const CHAT_QUESTION = "Why do we confess our sins to a priest and not straight to God?";
export const CHAT_ANSWER =
  "Because Jesus gave the Apostles that ministry: **“Whose sins you shall forgive, they are forgiven them”** (John 20:23). The priest acts in the person of Christ, and you are also free to speak to God directly at any time.";
export const CHAT_CITATIONS = [
  { label: "John 20:23", detail: "Douay-Rheims" },
  { label: "CCC 1461", detail: "Catechism of the Catholic Church, §1461" },
];
export const CRISIS_REPLY = "I’m really sorry you’re hurting. You don’t have to carry this alone. If you might harm yourself, please call your local emergency number or a crisis line now.";
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
