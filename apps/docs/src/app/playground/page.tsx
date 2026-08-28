"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  Form,
  FormItem,
  Heading,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";

export default function PlaygroundPage() {
  const [saved, setSaved] = useState(false);

  return (
    <Box as="main" style={{ maxWidth: 720, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level={1}>Playground</Heading>
          <Text color="secondary">
            A bigger, multi-component mock screen — toggle sketch/clean and watch every piece
            move together. This is currently a route inside <code>apps/docs</code>, not yet its
            own <code>apps/playground</code> app (see <code>ref/PLAN.md</code>) — the deeper,
            separate destination described in <code>ref/MARKETING_SITE.md</code> is still open.
          </Text>
        </Stack>

        <LivePreview>
          <Stack gap="lg">
            <Tabs defaultValue="profile">
              <TabList aria-label="Settings sections">
                <Tab value="profile">Profile</Tab>
                <Tab value="account">Account</Tab>
              </TabList>

              <TabPanel value="profile">
                <Stack gap="md" style={{ marginTop: "var(--rebar-space-md)" }}>
                  <Form<{ name: string; email: string }>
                    onSubmit={() => setSaved(true)}
                  >
                    <FormItem name="name" label="Name" required>
                      {(field) => <Input placeholder="Ada Lovelace" {...field} />}
                    </FormItem>
                    <FormItem name="email" label="Email" required>
                      {(field) => <Input type="email" placeholder="ada@example.com" {...field} />}
                    </FormItem>
                    <Stack direction="row" gap="sm">
                      <Button type="submit" variant="primary">
                        Save profile
                      </Button>
                    </Stack>
                  </Form>
                  {saved ? <Alert type="success" title="Saved" /> : null}
                </Stack>
              </TabPanel>

              <TabPanel value="account">
                <Stack gap="md" style={{ marginTop: "var(--rebar-space-md)" }}>
                  <Card>
                    <Stack gap="sm">
                      <Heading level={3}>Danger zone</Heading>
                      <Text size="sm" color="secondary">
                        This action cannot be undone.
                      </Text>
                      <Dialog
                        trigger={<Button variant="destructive">Delete account</Button>}
                        title="Delete account"
                        description="This cannot be undone."
                        footer={
                          <>
                            <Button variant="secondary">Cancel</Button>
                            <Button variant="destructive">Delete</Button>
                          </>
                        }
                      >
                        <Text size="sm">All of your data will be permanently removed.</Text>
                      </Dialog>
                    </Stack>
                  </Card>
                </Stack>
              </TabPanel>
            </Tabs>
          </Stack>
        </LivePreview>
      </Stack>
    </Box>
  );
}
