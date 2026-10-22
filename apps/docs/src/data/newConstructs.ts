/**
 * Constructs introduced in 1.0 (the current major line), shown with a "new" tag in the catalogue and on their reference pages.
 * 1.1.0 added no construct: it extended existing ones with opt-in props and tokens (see the Version Log), so nothing is added for it.
 * Prune this at each release, so "new" keeps meaning something. Derived from `git diff pre-basilika..v1.0.0` (components added);
 * `Chip` (also new in 1.0) and `ListItem`/`ListSection` share another construct's page and have no entry of their own.
 */
export const NEW_CONSTRUCTS: ReadonlySet<string> = new Set([
  "AuthScreen",
  "FilterBar",
  "HeroSplit",
  "ImagePicker",
  "List",
  "Onboarding",
  "PageHeader",
  "Prose",
  "ReadingView",
  "SearchInput",
  "Section",
  "Textarea",
  "ThemeScope",
  "TopBar",
]);
