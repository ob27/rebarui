/**
 * The full current icon set, for `/imitations/icon`'s own gallery — kept as plain presentation
 * data local to the docs app (like `narrationSources.mjs`), not shipped as part of the published
 * `rebar-ui` package, since nothing here is meant to be imported by a consumer directly (they
 * import the icon components themselves from `rebar-ui`, same as always). Add a new row here in
 * the same change that adds a new icon to `packages/core/src/components/icons.tsx` — this list is
 * this project's own record of "what's in the set today," and it drifts the moment one side is
 * updated without the other.
 */
import type { ComponentType } from "react";
import type { IconProps } from "rebar-ui";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MicIcon,
  StopCircleIcon,
  SendPlaneIcon,
  CopyIcon,
  DeleteIcon,
  MoveIcon,
  DownloadIcon,
  MoreIcon,
  LockIcon,
  UnlockIcon,
  SearchIcon,
  ErrorWarningIcon,
  WifiOffIcon,
  TimeIcon,
  CloseIcon,
  HomeIcon,
  FolderIcon,
  SettingsIcon,
  QuestionIcon,
  DashboardIcon,
  LineChartIcon,
  ChatIcon,
  TeamIcon,
  TaskIcon,
  CreditCardIcon,
  CalendarIcon,
  EnterOutlined,
  InboxOutlined,
} from "rebar-ui";

export type IconSource = "RemixIcon" | "Ant Design";

export interface IconManifestEntry {
  name: string;
  Icon: ComponentType<IconProps>;
  source: IconSource;
}

export const ICON_MANIFEST: IconManifestEntry[] = [
  { name: "ChevronDownIcon", Icon: ChevronDownIcon, source: "RemixIcon" },
  { name: "ChevronRightIcon", Icon: ChevronRightIcon, source: "RemixIcon" },
  { name: "ChevronLeftIcon", Icon: ChevronLeftIcon, source: "RemixIcon" },
  { name: "MicIcon", Icon: MicIcon, source: "RemixIcon" },
  { name: "StopCircleIcon", Icon: StopCircleIcon, source: "RemixIcon" },
  { name: "SendPlaneIcon", Icon: SendPlaneIcon, source: "RemixIcon" },
  { name: "CopyIcon", Icon: CopyIcon, source: "RemixIcon" },
  { name: "DeleteIcon", Icon: DeleteIcon, source: "RemixIcon" },
  { name: "MoveIcon", Icon: MoveIcon, source: "RemixIcon" },
  { name: "DownloadIcon", Icon: DownloadIcon, source: "RemixIcon" },
  { name: "MoreIcon", Icon: MoreIcon, source: "RemixIcon" },
  { name: "LockIcon", Icon: LockIcon, source: "RemixIcon" },
  { name: "UnlockIcon", Icon: UnlockIcon, source: "RemixIcon" },
  { name: "SearchIcon", Icon: SearchIcon, source: "RemixIcon" },
  { name: "ErrorWarningIcon", Icon: ErrorWarningIcon, source: "RemixIcon" },
  { name: "WifiOffIcon", Icon: WifiOffIcon, source: "RemixIcon" },
  { name: "TimeIcon", Icon: TimeIcon, source: "RemixIcon" },
  { name: "CloseIcon", Icon: CloseIcon, source: "RemixIcon" },
  { name: "HomeIcon", Icon: HomeIcon, source: "RemixIcon" },
  { name: "FolderIcon", Icon: FolderIcon, source: "RemixIcon" },
  { name: "SettingsIcon", Icon: SettingsIcon, source: "RemixIcon" },
  { name: "QuestionIcon", Icon: QuestionIcon, source: "RemixIcon" },
  { name: "DashboardIcon", Icon: DashboardIcon, source: "RemixIcon" },
  { name: "LineChartIcon", Icon: LineChartIcon, source: "RemixIcon" },
  { name: "ChatIcon", Icon: ChatIcon, source: "RemixIcon" },
  { name: "TeamIcon", Icon: TeamIcon, source: "RemixIcon" },
  { name: "TaskIcon", Icon: TaskIcon, source: "RemixIcon" },
  { name: "CreditCardIcon", Icon: CreditCardIcon, source: "RemixIcon" },
  { name: "CalendarIcon", Icon: CalendarIcon, source: "RemixIcon" },
  { name: "EnterOutlined", Icon: EnterOutlined, source: "Ant Design" },
  { name: "InboxOutlined", Icon: InboxOutlined, source: "Ant Design" },
];

export const ICON_SOURCE_INFO: Record<IconSource, { license: string; url: string }> = {
  RemixIcon: { license: "Apache License 2.0", url: "https://remixicon.com" },
  "Ant Design": { license: "MIT License", url: "https://ant-design.antgroup.com/components/icon" },
};
