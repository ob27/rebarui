import { describe, expect, it } from "vitest";
// @ts-expect-error -- jscodeshift's test helper has no published types
import { applyTransform } from "jscodeshift/dist/testUtils";
// @ts-expect-error -- importing the built CJS artifact directly, not a typed source module
import transform from "../../dist/transform.js";

function run(source: string): string {
  return applyTransform(transform, {}, { source });
}

describe("migrate-antd", () => {
  it("is a no-op when there's no rebar-ui import", () => {
    const source = `export function X() { return <div />; }`;
    expect(run(source)).toBe("");
  });

  it("renames Button's variant/size props to AntD's type/size vocabulary", () => {
    const source = `
import { Button } from "rebar-ui";
export const X = () => (
  <>
    <Button variant="primary" size="sm">A</Button>
    <Button variant="secondary">B</Button>
    <Button variant="tertiary">C</Button>
    <Button variant="destructive" size="lg">Delete</Button>
  </>
);`;
    const output = run(source);
    expect(output).toContain('from "antd"');
    expect(output).not.toContain("rebar-ui");
    expect(output).toContain('type="primary" size="small"');
    expect(output).toContain('type="default"');
    expect(output).toContain('type="text"');
    expect(output).toContain("danger");
    expect(output).toContain('size="large"');
    expect(output).not.toContain("variant=");
  });

  it("moves a Button's native HTML type to htmlType so it doesn't collide with AntD's variant-typed `type` prop", () => {
    // Regression test: found by dogfooding this codemod against a real submit button
    // (apps/docs/src/app/page.tsx) — the naive variant->type rename produced a duplicate,
    // invalid `type="submit" type="primary"` attribute pair.
    const source = `
import { Button } from "rebar-ui";
export const X = () => <Button type="submit" variant="primary">Submit</Button>;`;
    const output = run(source);
    expect(output).toContain('htmlType="submit"');
    expect(output).toContain('type="primary"');
    expect(output.match(/type="primary"/g)).toHaveLength(1);
  });

  it("renames Alert's title prop to AntD's message prop", () => {
    const source = `
import { Alert } from "rebar-ui";
export const X = () => <Alert type="error" title="Email is required" />;`;
    const output = run(source);
    expect(output).toContain('message="Email is required"');
    expect(output).not.toContain("title=");
  });

  it("renames Dialog to Modal, flags onOpenChange for review, and promotes description into a child", () => {
    const source = `
import { Dialog, Button } from "rebar-ui";
export const X = () => (
  <Dialog open={isOpen} onOpenChange={setIsOpen} title="Delete" description="This cannot be undone.">
    <Button variant="destructive">Delete</Button>
  </Dialog>
);`;
    const output = run(source);
    expect(output).toContain("Modal");
    expect(output).not.toMatch(/<Dialog/);
    expect(output).toContain("onCancel={setIsOpen}");
    expect(output).toContain("rebar-migrate: AntD's onCancel takes no argument");
    expect(output).not.toContain("description=");
    expect(output).toMatch(/<p>.*This cannot be undone\..*<\/p>/);
  });

  it("converts FormItem to Form.Item, required to rules, and unwraps the render-prop child", () => {
    const source = `
import { Form, FormItem, Input, Button } from "rebar-ui";
export const X = () => (
  <Form onSubmit={handleSubmit}>
    <FormItem name="email" label="Email" required>
      {(field) => <Input type="email" placeholder="you@example.com" {...field} />}
    </FormItem>
    <Button type="submit">Submit</Button>
  </Form>
);`;
    const output = run(source);
    expect(output).toContain("Form.Item");
    expect(output).not.toContain("FormItem");
    expect(output).toContain("onFinish={handleSubmit}");
    expect(output).not.toContain("onSubmit=");
    expect(output).toContain("rules={[{");
    expect(output).toContain("required: true");
    expect(output).toContain('<Input type="email" placeholder="you@example.com" />');
    expect(output).not.toContain("{...field}");
    expect(output).not.toContain("field) =>");
  });

  it("leaves components with no AntD equivalent (Box, Stack, Text, Heading, Tabs) untouched", () => {
    const source = `
import { Box, Stack, Text, Heading, Button } from "rebar-ui";
export const X = () => (
  <Box>
    <Stack>
      <Heading level={1}>Title</Heading>
      <Text>Body</Text>
      <Button variant="primary">Go</Button>
    </Stack>
  </Box>
);`;
    const output = run(source);
    expect(output).toContain('import { Box, Stack, Text, Heading } from "rebar-ui"');
    expect(output).toContain('import { Button } from "antd"');
    expect(output).toContain("<Box>");
    expect(output).toContain("<Stack>");
  });

  it("renames Checkbox's onCheckedChange to onChange, flagged for review (signatures differ)", () => {
    const source = `
import { Checkbox } from "rebar-ui";
export const X = () => <Checkbox onCheckedChange={setAccepted}>Accept terms</Checkbox>;`;
    const output = run(source);
    expect(output).toContain("onChange={setAccepted}");
    expect(output).not.toMatch(/^\s*onCheckedChange=/m);
    expect(output).toMatch(/rebar-migrate:.*CheckboxChangeEvent/);
  });

  it("renames RadioGroup to Radio.Group and onValueChange to onChange, flagged for review", () => {
    const source = `
import { Radio, RadioGroup } from "rebar-ui";
export const X = () => (
  <RadioGroup onValueChange={setChoice}>
    <Radio value="a">A</Radio>
  </RadioGroup>
);`;
    const output = run(source);
    expect(output).toContain("Radio.Group");
    expect(output).not.toContain("RadioGroup");
    expect(output).toContain("onChange={setChoice}");
    expect(output).toMatch(/rebar-migrate:.*RadioChangeEvent/);
  });

  it("renames Switch/Select/Slider's onValueChange to onChange without a review flag (compatible signatures)", () => {
    const source = `
import { Switch, Select, Slider } from "rebar-ui";
export const X = () => (
  <>
    <Switch onValueChange={setOn} />
    <Select options={opts} onValueChange={setValue} />
    <Slider onValueChange={setAmount} />
  </>
);`;
    const output = run(source);
    expect(output.match(/onChange=/g)).toHaveLength(3);
    expect(output).not.toContain("onValueChange");
    expect(output).not.toContain("rebar-migrate");
  });

  it("renames Tooltip's content prop to title", () => {
    const source = `
import { Tooltip } from "rebar-ui";
export const X = () => <Tooltip content="Saves your changes">{trigger}</Tooltip>;`;
    const output = run(source);
    expect(output).toContain('title="Saves your changes"');
    expect(output).not.toContain("content=");
  });

  it("leaves Popover, Dropdown, Progress, Avatar, Accordion, and Toast unmigrated (real structural mismatches, not just naming)", () => {
    const source = `
import { Popover, Dropdown, Progress, Avatar, Accordion, AccordionItem, Toast, ToastProvider, Button } from "rebar-ui";
export const X = () => <Button variant="primary">Go</Button>;`;
    const output = run(source);
    const rebarImportMatch = output.match(/import \{([\s\S]*?)\} from "rebar-ui"/);
    expect(rebarImportMatch).not.toBeNull();
    for (const name of [
      "Popover",
      "Dropdown",
      "Progress",
      "Avatar",
      "Accordion",
      "AccordionItem",
      "Toast",
      "ToastProvider",
    ]) {
      expect(rebarImportMatch![1]).toContain(name);
    }
    expect(output).toContain('import { Button } from "antd"');
  });
});
