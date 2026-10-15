# @rebar-ui/theme-con

Rebar's "Con" theme: electric blue, concrete and ink, thick outlines and hard offset shadows, themed around the concrete-block mascot (see the `Puppet` construct).

```tsx
import "rebar-ui/style.css";
import "@rebar-ui/theme-con/theme.css";

// <html data-rebar-theme="con" data-theme="light">   (or data-theme="dark")
```

It defines the same `--rebar-*` tokens as `@rebar-ui/theme-clean` and `@rebar-ui/theme-sketch`, plus the `--rebar-puppet-bubble-*` tokens for the Puppet's speech bubble. The UI blue is `#0b62d6` (5.5:1 with white text); the brand blue `#1181ff` is for large poster areas only, because white text on it is 3.7:1 and fails WCAG AA for body text.
