"use client";

import { useState } from "react";
import { CommentThread, Heading, Stack, Text } from "rebar-ui";
import type { CommentThreadComment } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const INITIAL_COMMENTS: CommentThreadComment[] = [
  {
    id: "c1",
    authorName: "Ada Lovelace",
    body: "This looks great — the placement layer's live-data binding closes a real gap.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likeCount: 4,
    replies: [
      {
        id: "c1-r1",
        authorName: "Alan Turing",
        body: "Agreed. Curious how this interacts with the Opinion-tier mechanical check.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        likeCount: 1,
      },
    ],
  },
  {
    id: "c2",
    authorName: "Grace Hopper",
    body: "One question about backward compatibility for existing static blocks.",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    likeCount: 0,
  },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<CommentThread comments={comments} onReply={handleReply} onToggleLike={handleLike} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["CommentThread"] ?? [] },
  {
    type: "doc-section",
    heading: "Not the same shape as ChatThread",
    body: [
      {
        kind: "text",
        text: "`ChatThread` is a live, linear messaging transcript — one flat list, streaming, typing indicators. This is a threaded *discussion*: replies nest under their parent (the GitHub PR comment / forum thread pattern), each thread collapses independently, and likes toggle per comment. Real per-comment state, not a mirrored value — the same state-machine richness that makes this an Opinion.",
      },
    ],
  },
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

  const addReply = (parentId: string, body: string) => {
    const reply: CommentThreadComment = {
      id: `${parentId}-${Date.now()}`,
      authorName: "You",
      body,
      timestamp: new Date(),
      likeCount: 0,
    };
    const insert = (list: CommentThreadComment[]): CommentThreadComment[] =>
      list.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies ?? []), reply] }
          : { ...c, replies: c.replies ? insert(c.replies) : c.replies },
      );
    setComments((prev) => insert(prev));
  };

  const toggleLike = (id: string) => {
    const toggle = (list: CommentThreadComment[]): CommentThreadComment[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likeCount: (c.likeCount ?? 0) + (c.liked ? -1 : 1) }
          : { ...c, replies: c.replies ? toggle(c.replies) : c.replies },
      );
    setComments((prev) => toggle(prev));
  };

  return (
    <Stack gap="lg">
      <Heading level={1}>CommentThread</Heading>
      <Text color="secondary">A nested-reply discussion thread — try replying or liking below.</Text>

      <LivePreview>
        <CommentThread comments={comments} onReply={addReply} onToggleLike={toggleLike} />
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
