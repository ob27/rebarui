import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";
import App from "./App";

// Embedded live in an iframe on the homepage's migration-comparison section — that page's own
// dark-mode toggle (DevTools) can't reach into a separate document, so the parent passes the
// ambient theme in via a query param instead (see MigrationComparison.tsx). Defaults to light so
// this demo still renders correctly if loaded directly, with no param at all.
const isDark = new URLSearchParams(window.location.search).get("theme") === "dark";

if (isDark) {
  document.body.style.background = "#141414";
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
