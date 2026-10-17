/**
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
export const MASS_FIRST_READING_CITATION = "First reading ┬╖ Galatians 3:22-29";
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
  { title: "TodayΓÇÖs readings", description: "Open Athic each day to the Mass readings, with a one-tap check-in when youΓÇÖve been to Mass.", tint: "tint-1" },
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
  "Because Jesus gave the Apostles that ministry: **ΓÇ£Whose sins you shall forgive, they are forgiven themΓÇ¥** (John 20:23). The priest acts in the person of Christ, and you are also free to speak to God directly at any time.";
export const CHAT_CITATIONS = [
  { label: "John 20:23", detail: "Douay-Rheims" },
  { label: "CCC 1461", detail: "Catechism of the Catholic Church, ┬º1461" },
];
export const CRISIS_REPLY = "IΓÇÖm really sorry youΓÇÖre hurting. You donΓÇÖt have to carry this alone. If you might harm yourself, please call your local emergency number or a crisis line now.";