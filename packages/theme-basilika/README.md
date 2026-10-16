# @rebar-ui/theme-basilika

Rebar UI's canonical look. Cream and navy, deep coral for action, Fraunces display type over Inter, soft rounded surfaces, light and dark.

```ts
import "rebar-ui/style.css";
import "@rebar-ui/theme-basilika/theme.css";
```

That is all. The tokens apply to `:root` (or any element with `data-rebar-theme="basilika"`) at specificity 0, and dark follows `data-theme="dark"` on any ancestor. Fonts are self-hosted (`dist/fonts`), no network request.

- `art/*.svg`: grain panels (gradient plus film grain) for hero and section backgrounds, used as `background-image` or `<img>`.
- Contrast: the light action colour is the deep coral `#c4402a` (5.1:1 with white); in dark the action is bright coral with navy text.
