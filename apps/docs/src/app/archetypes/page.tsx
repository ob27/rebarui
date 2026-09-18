import { Heading, Image, Stack, Text } from "rebar-ui";

export default function ArchetypesPage() {
  return (
    <Stack gap="lg" style={{ maxWidth: 720 }}>
      <Image src="/catalogue-heros/archetypes.jpeg" alt="Archetypes hero image" style={{ width: "100%", borderRadius: "8px" }} />

      <Heading level={1}>Where Interfaces Come From</Heading>

      <Text>
        Almost nothing in a graphical interface was invented for the screen. When computing needed a
        way to represent &quot;press this to cause an effect,&quot; it didn&apos;t invent a new visual
        language — it borrowed one, from a century of mechanical switches, levers, and dials whose
        shapes already carried a shared, learned meaning. A button looks raised because a real button
        you could press was raised. A toggle slides because a real toggle switch slides. The digital
        form kept the ancestor&apos;s silhouette long after it discarded the ancestor&apos;s
        mechanism.
      </Text>

      <Heading level={2}>Why the ancestry still matters</Heading>

      <Text>
        This borrowing isn&apos;t incidental decoration; it&apos;s how affordance works. James
        Gibson&apos;s original sense of the term — later popularized for design by Don Norman in{" "}
        <em>The Design of Everyday Things</em> — is that an object&apos;s form signals what can be
        done with it, because that form resembles something whose function we already understand. A
        raised rectangle reads as pressable before a single line of its behavior is explained,
        because it resembles a lever. In Peircean semiotic terms, it&apos;s functioning as an{" "}
        <em>icon</em>: a sign that means what it means by resembling its referent, not by arbitrary
        convention.
      </Text>

      <Text>
        Once a control is fully virtual, nothing physically forces it to keep that shape. A button
        doesn&apos;t need to look raised to be clickable; a toggle doesn&apos;t need to look like it
        slides. It keeps that shape because the shape is still doing communicative work — and that
        creates a real, practical distinction worth making deliberately rather than by habit: which
        features of a control&apos;s inherited form are load-bearing (they&apos;re still how a user
        infers its behavior) and which are just décor, carried forward because the last framework did
        it that way. Knowing the difference is what separates a component built on understanding from
        one built on imitation.
      </Text>

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
