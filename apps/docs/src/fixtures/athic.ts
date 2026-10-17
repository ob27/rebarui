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
  { id: "gospel", title: "Explain todayΓÇÖs Gospel", when: "3 days ago", art: 2 },
  { id: "silent", title: "How should I pray when God feels completely silent and nothing seems to help?", when: "Last week", art: 3 },
  { id: "mary", title: "Is Mary really sinless? Where is that in Scripture?", when: "Just now", art: 4 },
];
export const discussion = (id: string): Discussion => DISCUSSIONS.find((d) => d.id === id) ?? DISCUSSIONS[0];

export const QUESTION = "Why do we confess our sins to a priest and not straight to God?";
export const ANSWER =
  "Because Jesus gave the Apostles that very ministry. After the Resurrection he told them, ΓÇ£Whose sins you shall forgive, they are forgiven themΓÇ¥ (John 20:23).";

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
  body: "Catholics confess to a priest because Jesus gave his Apostles the ministry of reconciliation. ΓÇ£Whose sins you shall forgive, they are forgiven themΓÇ¥ (John 20:23).",
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

export const REFLECTION_PLACEHOLDER = "What stayed with you from todayΓÇÖs Gospel?";
export const REFLECTION =
  "Peter asked for faith. The widow only asked again. I keep dropping my evening prayer when I am tired; today I will ask once more, even for two minutes.";
export const FEEDBACK_PLACEHOLDER = "What would you like to tell us?";