import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import type { Construct } from "@rebar-ui/placement";

const blocks: Construct[] = [
  {
    type: "hero",
    title: "Geneses",
    subtitle: "Starter projects grounded in the rebar-ui framework",
    imageSrc: "/catalogue-heros/genses.jpeg",
  },
  {
    type: "doc-section",
    heading: "What are Geneses?",
    body: [
      { kind: "text", text: "Geneses are complete, production-ready starter projects that demonstrate the full rebar-ui framework in action. Each genesis is a well-architected application that showcases best practices, common patterns, and the power of the construct-based approach." },
      { kind: "text", text: "Unlike individual constructs (components and blocks), geneses are full applications you can clone, customize, and build upon. They serve as both learning resources and starting points for your own projects." },
    ],
  },
  {
    type: "doc-section",
    heading: "Available Geneses",
    body: [
      { kind: "text", text: "Geneses will be added as the framework matures. Each genesis will include complete source code, documentation, and deployment instructions." },
    ],
  },
];

export default function Page() {
  return <NextBlockRenderer blocks={blocks} />;
}
