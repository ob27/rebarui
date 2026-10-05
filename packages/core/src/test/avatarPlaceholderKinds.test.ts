import { describe, expect, it } from "vitest";
import { AVATAR_PLACEHOLDERS } from "../assets/avatarPlaceholders";
import { AVATAR_PLACEHOLDER_KINDS } from "../assets/avatarPlaceholderKinds";

describe("AVATAR_PLACEHOLDER_KINDS", () => {
  it("has one kind per portrait, in the same order", () => {
    expect(AVATAR_PLACEHOLDER_KINDS).toHaveLength(AVATAR_PLACEHOLDERS.length);
  });

  it("only uses male, female and creature, and every kind has portraits to give out", () => {
    for (const k of AVATAR_PLACEHOLDER_KINDS) expect(["male", "female", "creature"]).toContain(k);
    for (const k of ["male", "female", "creature"]) expect(AVATAR_PLACEHOLDER_KINDS.filter((x) => x === k).length).toBeGreaterThan(5);
  });
});
