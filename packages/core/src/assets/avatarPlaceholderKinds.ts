/**
 * Who each illustrated portrait in `AVATAR_PLACEHOLDERS` shows, by index (same order, same length): "male" or "female" for a human
 * portrait, "creature" for an animal or monster (dog, cat, panda, dragon, a box for a head...). Judged by how the character is drawn;
 * a few are ambiguous and were put on the nearer side. Lets an app pair a portrait with a name: a male name gets only the "male"
 * ones, a female name only the "female" ones, and the "creature" ones (like any portrait) suit an androgynous name.
 */
export type AvatarKind = "male" | "female" | "creature";

const M = "male", F = "female", C = "creature";

export const AVATAR_PLACEHOLDER_KINDS: readonly AvatarKind[] = [
  /*  0 */ F, F, F, M, M, M, M, M,
  /*  8 */ F, M, M, M, F, F, M, M,
  /* 16 */ M, M, F, F, F, M, C, M,
  /* 24 */ M, F, F, M, C, F, C, M,
  /* 32 */ F, M, M, M, M, M, M, F,
  /* 40 */ M, M, F, M, F, M, M, F,
  /* 48 */ M, C, F, F, M, M, M, M,
  /* 56 */ F, F, F, F, C, C, C, C,
  /* 64 */ C, M, F, F, M, M, F, M,
  /* 72 */ M, F, M, F, M, M, M, M,
  /* 80 */ M, F, F, F, C, M, F, M,
  /* 88 */ M, F, F, M, M, M, M, C,
];
