import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geneses",
  description: "Starter projects grounded in the rebar-ui framework",
};

// Geneses is a single full-width marketing page now (hero, AI Hive, how it works), so it no longer sits inside the tier sidebar layout.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
