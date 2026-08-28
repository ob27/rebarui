import type { Metadata } from "next";
import "rebar-ui/style.css";
import "@rebar-ui/theme-sketch/theme.css";
import "@rebar-ui/theme-clean/theme.css";

export const metadata: Metadata = {
  title: "Rebar UI",
  description:
    "Headless-first, intentionally low-fidelity React components, built to be re-skinned into a real design system later.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-rebar-theme="sketch">
      <body>{children}</body>
    </html>
  );
}
