import type { Metadata } from "next";
import "rebar-ui/style.css";
import "@rebar-ui/theme-basilika/theme.css";
import "@/styles/site.css";
// Statically imported (unlike the JS below): a static import() chained inside next/dynamic's
// loader broke Turbopack's dynamic-import transform ("not an ecmascript client_module"), and
// a few KB of unused CSS in production is a much smaller concern than shipping the panel's JS
// behavior — see DevToolsMount.tsx for how the JS itself stays out of production.
import "@rebar-ui/devtools/style.css";
import { DevToolsMount } from "@/components/DevToolsMount";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Rebar UI",
  description: "React constructs in five tiers, one look.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <SiteHeader />
        {children}
        <SiteFooter />
        <DevToolsMount />
      </body>
    </html>
  );
}
