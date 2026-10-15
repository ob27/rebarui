/**
 * Inline SVG data URIs used as placeholder art on the docs pages, so no page depends on an external
 * image. `APP_SCREEN` is a phone-shaped app screen with its own header and tab bar at the very top
 * and bottom edges: if a frame crops or distorts it, those edges are the first thing to go.
 */
const svg = (markup: string) => `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;

export const APP_SCREEN = svg(
  '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="720" viewBox="0 0 360 720"><rect width="360" height="720" fill="#f5f5f5"/><rect width="360" height="64" fill="#0066cc"/><text x="20" y="40" font-family="sans-serif" font-size="20" font-weight="700" fill="#fff">Today</text><rect x="20" y="88" width="320" height="150" rx="14" fill="#fff" stroke="#e0e0e0"/><rect x="36" y="108" width="160" height="14" rx="7" fill="#bdbdbd"/><rect x="36" y="136" width="270" height="10" rx="5" fill="#e0e0e0"/><rect x="36" y="156" width="230" height="10" rx="5" fill="#e0e0e0"/><rect x="20" y="258" width="320" height="150" rx="14" fill="#fff" stroke="#e0e0e0"/><rect x="36" y="278" width="140" height="14" rx="7" fill="#bdbdbd"/><rect x="36" y="306" width="270" height="10" rx="5" fill="#e0e0e0"/><rect x="20" y="428" width="320" height="150" rx="14" fill="#fff" stroke="#e0e0e0"/><rect x="36" y="448" width="180" height="14" rx="7" fill="#bdbdbd"/><rect y="640" width="360" height="80" fill="#fff"/><rect y="640" width="360" height="1" fill="#e0e0e0"/><circle cx="60" cy="680" r="12" fill="#0066cc"/><circle cx="140" cy="680" r="12" fill="#bdbdbd"/><circle cx="220" cy="680" r="12" fill="#bdbdbd"/><circle cx="300" cy="680" r="12" fill="#bdbdbd"/></svg>',
);

export const APP_SCREEN_2 = svg(
  '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="720" viewBox="0 0 360 720"><rect width="360" height="720" fill="#fff"/><rect width="360" height="64" fill="#2e7d32"/><text x="20" y="40" font-family="sans-serif" font-size="20" font-weight="700" fill="#fff">Journal</text><rect x="20" y="88" width="320" height="22" rx="11" fill="#e8f5e9"/><rect x="20" y="128" width="320" height="12" rx="6" fill="#e0e0e0"/><rect x="20" y="152" width="300" height="12" rx="6" fill="#e0e0e0"/><rect x="20" y="176" width="320" height="12" rx="6" fill="#e0e0e0"/><rect x="20" y="200" width="260" height="12" rx="6" fill="#e0e0e0"/><rect y="640" width="360" height="80" fill="#f5f5f5"/><circle cx="60" cy="680" r="12" fill="#bdbdbd"/><circle cx="140" cy="680" r="12" fill="#2e7d32"/><circle cx="220" cy="680" r="12" fill="#bdbdbd"/><circle cx="300" cy="680" r="12" fill="#bdbdbd"/></svg>',
);

export const WIDE_SCREEN = svg(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750"><rect width="1200" height="750" fill="#f5f5f5"/><rect width="1200" height="70" fill="#0066cc"/><text x="40" y="45" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff">Dashboard</text><rect x="40" y="110" width="540" height="590" rx="14" fill="#e0e0e0"/><rect x="620" y="110" width="540" height="590" rx="14" fill="#e0e0e0"/></svg>',
);

/** Wide, painterly-enough backdrop art: 1600 px wide, so it is not stretched on a large section. */
export const BACKDROP_ART = svg(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="700" viewBox="0 0 1600 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8bd72"/><stop offset="0.5" stop-color="#c4402a"/><stop offset="1" stop-color="#2b2f5c"/></linearGradient></defs><rect width="1600" height="700" fill="url(#g)"/><circle cx="1250" cy="180" r="140" fill="#fff" fill-opacity="0.35"/><path d="M0 520 C 300 420 500 600 800 500 S 1300 420 1600 520 V700 H0Z" fill="#1d2040" fill-opacity="0.55"/></svg>',
);
