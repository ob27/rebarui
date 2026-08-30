"use client";

import { useEffect, useState } from "react";
import { Box, Stack, Text } from "rebar-ui";

interface Section {
  id: string;
  label: string;
}

export function SectionNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <Box
      as="nav"
      aria-label="Section navigation"
      className="bench-section-nav"
      style={{ width: 180, flexShrink: 0, position: "sticky", top: "var(--rebar-space-xl)" }}
    >
      <style>{`
        @media (max-width: 900px) {
          .bench-section-nav { display: none; }
        }
      `}</style>
      <Stack gap="xs">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} style={{ textDecoration: "none" }}>
            <Text
              as="span"
              size="sm"
              color={activeId === section.id ? undefined : "secondary"}
              style={{
                fontWeight:
                  activeId === section.id ? "var(--rebar-font-weight-semibold)" : undefined,
              }}
            >
              {section.label}
            </Text>
          </a>
        ))}
      </Stack>
    </Box>
  );
}
