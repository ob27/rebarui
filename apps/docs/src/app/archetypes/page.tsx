import { Heading, Image, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Where Interfaces Come From",
    level: 1,
    narration: { src: "/narration/archetypes-where-interfaces-come-from.mp3" },
    body: [
      {
        kind: "text",
        text: 'Almost nothing in a graphical interface was invented for the screen. When computing needed a way to represent "press this to cause an effect," it didn\'t invent a new visual language — it borrowed one, from a century of mechanical switches, levers, and dials whose shapes already carried a shared, learned meaning. A button looks raised because a real button you could press was raised. A toggle slides because a real toggle switch slides. The digital form kept the ancestor\'s silhouette long after it discarded the ancestor\'s mechanism.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Why the ancestry still matters",
    narration: { src: "/narration/archetypes-why-ancestry-matters.mp3" },
    body: [
      {
        kind: "text",
        text: "This borrowing isn't incidental decoration; it's how affordance works. James Gibson's original sense of the term — later popularized for design by Don Norman in *The Design of Everyday Things* — is that an object's form signals what can be done with it, because that form resembles something whose function we already understand. A raised rectangle reads as pressable before a single line of its behavior is explained, because it resembles a lever. In Peircean semiotic terms, it's functioning as an *icon*: a sign that means what it means by resembling its referent, not by arbitrary convention.",
      },
      {
        kind: "text",
        text: "Once a control is fully virtual, nothing physically forces it to keep that shape. A button doesn't need to look raised to be clickable; a toggle doesn't need to look like it slides. It keeps that shape because the shape is still doing communicative work — and that creates a real, practical distinction worth making deliberately rather than by habit: which features of a control's inherited form are load-bearing (they're still how a user infers its behavior) and which are just décor, carried forward because the last framework did it that way. Knowing the difference is what separates a component built on understanding from one built on imitation.",
      },
    ],
  },
];

export default function ArchetypesPage() {
  return (
    <Stack gap="lg" style={{ maxWidth: 720 }}>
      <Image src="/catalogue-heros/archetypes.jpeg" alt="Archetypes hero image" style={{ width: "100%", borderRadius: "8px" }} />

      <NextBlockRenderer blocks={BLOCKS} />

      <Heading level={2}>The articles</Heading>

      <Text>
        Each piece here takes one interface pattern and traces it back: what problem the original
        physical mechanism solved, what constraints it operated under, and which of those constraints
        survive today as pure visual convention rather than functional necessity.
      </Text>

      <Text>
        <a href="/archetypes/the-button" className="rebar-link">
          <strong>The Button</strong>
        </a>{" "}
        — from mechanical lever to switch to digital leverage. How the archetype of &quot;button&quot;
        is actually a &quot;lever,&quot; and why that physical ancestry still shapes the digital
        form&apos;s design today.
      </Text>
    </Stack>
  );
}
