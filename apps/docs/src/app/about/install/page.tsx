import { Heading, Stack, Text, CodeBlock } from "rebar-ui";

const PACKAGE_JSON = `{
  "dependencies": {
    "rebar-ui": "file:vendor/rebar-ui-1.1.0.tgz",
    "@rebar-ui/placement": "file:vendor/rebar-ui-placement-1.1.0.tgz",
    "@rebar-ui/theme-basilika": "file:vendor/rebar-ui-theme-basilika-1.1.0.tgz"
  },
  "overrides": { "rebar-ui": "file:vendor/rebar-ui-1.1.0.tgz" },
  "pnpm": { "overrides": { "rebar-ui": "file:vendor/rebar-ui-1.1.0.tgz" } }
}`;

export default function InstallPage() {
  return (
    <Stack gap="lg" style={{ maxWidth: 800, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Heading level={1}>Install</Heading>
      <Text color="secondary">
        Rebar UI is not on the npm registry. Each release is published as three tarballs attached to
        the GitHub release, and apps install them from a local folder such as <code>vendor/</code>.
      </Text>

      <Heading level={2}>What a release contains</Heading>
      <Text color="secondary">
        Pushing a tag <code>vX.Y.Z</code> builds the packages and attaches{" "}
        <code>rebar-ui-X.Y.Z.tgz</code> (core), <code>rebar-ui-placement-X.Y.Z.tgz</code> and{" "}
        <code>rebar-ui-theme-basilika-X.Y.Z.tgz</code>. The tag must equal the version in{" "}
        <code>packages/core/package.json</code>.
      </Text>

      <Heading level={2}>Install in an app</Heading>
      <Text color="secondary">
        The repository is private, so asset URLs need a token. Download the assets with the GitHub
        CLI, then point at them with <code>file:</code> paths.
      </Text>
      <CodeBlock code={"gh release download v1.1.0 -R ob27/rebarui -D vendor"} />
      <CodeBlock code={PACKAGE_JSON} />
      <Text color="secondary">
        The override is required. <code>@rebar-ui/placement</code> depends on <code>rebar-ui@1.1.0</code>{" "}
        (the <code>workspace:*</code> range is rewritten at pack time), which is not on the registry.
        Keep only the block for your package manager: <code>overrides</code> for npm,{" "}
        <code>pnpm.overrides</code> for pnpm.
      </Text>

      <Heading level={2}>Styles</Heading>
      <CodeBlock
        code={'import "rebar-ui/style.css";\nimport "@rebar-ui/theme-basilika/theme.css";'}
      />
      <Text color="secondary">React 18.3+ or 19 is a peer dependency.</Text>

      <Heading level={2}>Building the tarballs locally</Heading>
      <CodeBlock code={"corepack pnpm install\nnode scripts/pack-release.mjs"} />
      <Text color="secondary">
        The tarballs are written to <code>release-artifacts/</code>, which is gitignored.
      </Text>
    </Stack>
  );
}
