"use client";

import { useState } from "react";
import { Card, CommentThread, Heading, Stack, Tag, Text } from "rebar-ui";
import type { CommentThreadComment } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { person } from "@/fixtures/tideline";

const CODE = `const [comments, setComments] = useState(initialComments);

<CommentThread comments={comments} onReply={addReply} onToggleLike={toggleLike} />`;

const INITIAL_COMMENTS: CommentThreadComment[] = [
  {
    id: "c1",
    authorName: person("maya").name,
    body: "Homepage hero is in. The harbour photo crops badly on narrow screens, can someone check?",
    timestamp: new Date(2026, 9, 17, 9, 20),
    likeCount: 3,
    replies: [
      { id: "c1-r1", authorName: person("jonas").name, body: "On it. I'll switch it to the portrait crop under 600px.", timestamp: new Date(2026, 9, 17, 9, 48), likeCount: 1 },
    ],
  },
  { id: "c2", authorName: person("priya").name, body: "The launch checklist now lists the crew sign-off as its own step.", timestamp: new Date(2026, 9, 17, 10, 5), likeCount: 0 },
];

const LIKED: CommentThreadComment[] = [{ ...INITIAL_COMMENTS[1], liked: true, likeCount: 2 }];

function mapTree(list: CommentThreadComment[], fn: (c: CommentThreadComment) => CommentThreadComment): CommentThreadComment[] {
  return list.map((c) => fn({ ...c, replies: c.replies ? mapTree(c.replies, fn) : c.replies }));
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["CommentThread"] ?? [] },
  {
    type: "doc-section",
    heading: "Presentational, like ChatThread and FileUpload",
    body: [
      {
        kind: "text",
        text: "Does no networking of its own — the caller owns appending a new reply to `comments` inside `onReply`, the same convention `ChatThread`'s own `messages` prop and `FileUpload` (no upload) already use.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="comment-thread"` on the root; parts: `comment` (carrying `data-rebar-depth`), `text`, `timestamp`, `like`, `reply-toggle`, `collapse-toggle`, `replies`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Comment` component (deprecated in v5, moved to `@ant-design/compatible`) is the closest analog but has no built-in nesting/collapse of its own — not a 1:1 codemod target.",
      },
    ],
  },
];

export default function CommentThreadPage() {
  const [comments, setComments] = useState<CommentThreadComment[]>(INITIAL_COMMENTS);
  const [note, setNote] = useState<CommentThreadComment[]>(INITIAL_COMMENTS.slice(1));

  const replyIn = (set: typeof setComments) => (parentId: string, body: string) => {
    const reply: CommentThreadComment = { id: `${parentId}-${body.length}-${Math.random().toString(36).slice(2, 6)}`, authorName: person("leo").name, body, timestamp: new Date(2026, 9, 17, 11, 0), likeCount: 0 };
    set((prev) => mapTree(prev, (c) => (c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c)));
  };
  const likeIn = (set: typeof setComments) => (id: string) =>
    set((prev) => mapTree(prev, (c) => (c.id === id ? { ...c, liked: !c.liked, likeCount: (c.likeCount ?? 0) + (c.liked ? -1 : 1) } : c)));

  return (
    <Stack gap="lg">
      <Heading level={1}>CommentThread</Heading>
      <Text color="secondary">A discussion where replies nest under their parent. Try replying or liking.</Text>

      <DemoStage
        title="Task discussion"
        caption="Reply, like, collapse a branch"
        code={CODE}
        states={[
          { label: "Empty", node: <CommentThread comments={[]} emptyLabel="No comments yet. Be the first." /> },
          { label: "Liked by you", node: <CommentThread comments={LIKED} /> },
        ]}
      >
        <CommentThread comments={comments} onReply={replyIn(setComments)} onToggleLike={likeIn(setComments)} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Task panel" caption="The thread under a task's details" widths={false}>
        <Card style={{ maxWidth: 560, margin: "0 auto" }} title="Harbour homepage">
          <Stack gap="md">
            <Stack direction="row" gap="sm" align="center">
              <Tag tone="info">In progress</Tag>
              <Tag>Design</Tag>
              <Text size="sm" color="secondary">Assigned to {person("maya").name}</Text>
            </Stack>
            <CommentThread comments={note} onReply={replyIn(setNote)} onToggleLike={likeIn(setNote)} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
