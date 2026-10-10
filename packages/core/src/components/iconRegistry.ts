import type { ComponentType } from "react";
import type { IconProps } from "./iconFactory";
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
  Robot3Icon,
  AddIcon,
  AiAgentIcon,
  ArrowUpIcon,
  CheckIcon,
  CodeSSlashIcon,
  HistoryIcon,
  ScreenshotIcon,
  CameraIcon,
  KeyboardIcon,
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "./icons";
import * as RemixBulkIcons from "./icons-remix";
import * as AntdBulkIcons from "./icons-antd";

// The registry of every icon this package ships, tagged by source. Kept in its own module on purpose:
// it namespace-imports the ~1,800 generated icons, so anything that imports it keeps all of them in a
// consumer's bundle. Components import single icons from "./icons" and never touch this file; only
// the name lookup (`getIconByName`), the docs icon catalogue and `ICON_REGISTRY` itself do.
// ICON_REGISTRY — every icon this package ships, tagged with its real source, for the
// `/imitations/icon` catalogue page. Built once, here, rather than hand-listed a second time in
// `apps/docs/src/data/iconManifest.ts` — that file would otherwise need one entry per icon (1,835
// of them) kept in sync by hand every time either bulk set regenerates. The two bulk sets are
// pulled in via a namespace import specifically so a newly-generated icon in either file is picked
// up automatically the next time this module loads, with no second list to remember to update.
export type IconSource = "RemixIcon" | "Ant Design";

export interface IconRegistryEntry {
  name: string;
  Icon: ComponentType<IconProps>;
  source: IconSource;
}

const CURATED: IconRegistryEntry[] = [
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
  { name: "Robot3Icon", Icon: Robot3Icon, source: "RemixIcon" },
  { name: "AddIcon", Icon: AddIcon, source: "RemixIcon" },
  { name: "AiAgentIcon", Icon: AiAgentIcon, source: "RemixIcon" },
  { name: "ArrowUpIcon", Icon: ArrowUpIcon, source: "RemixIcon" },
  { name: "CheckIcon", Icon: CheckIcon, source: "RemixIcon" },
  { name: "CodeSSlashIcon", Icon: CodeSSlashIcon, source: "RemixIcon" },
  { name: "HistoryIcon", Icon: HistoryIcon, source: "RemixIcon" },
  { name: "ScreenshotIcon", Icon: ScreenshotIcon, source: "RemixIcon" },
  { name: "CameraIcon", Icon: CameraIcon, source: "RemixIcon" },
  { name: "KeyboardIcon", Icon: KeyboardIcon, source: "RemixIcon" },
  { name: "BoldOutlined", Icon: BoldOutlined, source: "Ant Design" },
  { name: "ItalicOutlined", Icon: ItalicOutlined, source: "Ant Design" },
  { name: "LinkOutlined", Icon: LinkOutlined, source: "Ant Design" },
  { name: "OrderedListOutlined", Icon: OrderedListOutlined, source: "Ant Design" },
  { name: "PictureOutlined", Icon: PictureOutlined, source: "Ant Design" },
  { name: "UnderlineOutlined", Icon: UnderlineOutlined, source: "Ant Design" },
  { name: "UnorderedListOutlined", Icon: UnorderedListOutlined, source: "Ant Design" },
];

export const ICON_REGISTRY: IconRegistryEntry[] = [
  ...CURATED,
  ...Object.entries(RemixBulkIcons).map(([name, Icon]) => ({
    name,
    Icon: Icon as ComponentType<IconProps>,
    source: "RemixIcon" as const,
  })),
  ...Object.entries(AntdBulkIcons).map(([name, Icon]) => ({
    name,
    Icon: Icon as ComponentType<IconProps>,
    source: "Ant Design" as const,
  })),
];
