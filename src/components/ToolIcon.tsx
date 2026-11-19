"use client";

import {
  AlignLeft,
  Anchor,
  ArrowLeftRight,
  ArrowRight,
  Binary,
  Braces,
  Cake,
  Camera,
  Check,
  ChevronLeft,
  Clock,
  Code,
  Contrast,
  Copy,
  Crop,
  DollarSign,
  Download,
  Droplet,
  Eraser,
  Eye,
  Feather,
  FileImage,
  Fingerprint,
  Gauge,
  GitMerge,
  Globe,
  Grid,
  Hash,
  Image,
  Info,
  Key,
  Layers as LayersIcon,
  Lightbulb,
  Link,
  List,
  Lock,
  Maximize,
  Mic,
  Minimize2,
  MoreHorizontal,
  Music,
  Music2,
  Network,
  Palette,
  Percent,
  Pipette,
  PlayCircle,
  QrCode,
  Quote,
  Ratio,
  RefreshCw,
  RotateCw,
  Scale,
  ScanText,
  Scissors,
  Search,
  Shield,
  ShieldCheck,
  Shuffle,
  Sparkles,
  SpellCheck,
  Stamp,
  Table,
  Terminal,
  ThumbsUp,
  Trash2,
  Type,
  Type as TypeIcon,
  Upload,
  User,
  UserCircle,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IconComponent = LucideIcon | typeof Subtitles;

const ICON_MAP: Record<string, IconComponent> = {
  "merge": LayersIcon,
  "scissors": Scissors,
  "file_image": FileImage,
  "file-image": FileImage,
  "image": Image,
  "minimize2": Minimize2,
  "minimize-2": Minimize2,
  "rotate_cw": RotateCw,
  "rotate-cw": RotateCw,
  "stamp": Stamp,
  "maximize": Maximize,
  "refresh": RefreshCw,
  "refresh-cw": RefreshCw,
  "crop": Crop,
  "scan_text": ScanText,
  "scan-text": ScanText,
  "scan_eye": Eye,
  "scan-eye": Eye,
  "grid": Grid,
  "contrast": Contrast,
  "palette": Palette,
  "droplet": Droplet,
  "pipette": Pipette,
  "hash": Hash,
  "type": Type,
  "case_upper": TypeIcon,
  "case-upper": TypeIcon,
  "broom": Eraser,
  "eraser": Eraser,
  "copy_x": Copy,
  "copy": Copy,
  "list": List,
  "link": Link,
  "align_left": AlignLeft,
  "align-left": AlignLeft,
  "shuffle": Shuffle,
  "spell_check": SpellCheck,
  "spell-check": SpellCheck,
  "code": Code,
  "diff": GitMerge,
  "regex": Search,
  "braces": Braces,
  "feather": Feather,
  "camera": Camera,
  "table": Table,
  "swap": ArrowLeftRight,
  "arrow-left-right": ArrowLeftRight,
  "qr": QrCode,
  "qr-code": QrCode,
  "key": Key,
  "fingerprint": Fingerprint,
  "binary": Binary,
  "clock": Clock,
  "scale_balance": Scale,
  "scale": Scale,
  "percent": Percent,
  "cake": Cake,
  "dollar": DollarSign,
  "dollar-sign": DollarSign,
  "ratio": Ratio,
  "quote": Quote,
  "user_circle": UserCircle,
  "user-circle": UserCircle,
  "lightbulb": Lightbulb,
  "anchor": Anchor,
  "play_circle": PlayCircle,
  "play-circle": PlayCircle,
  "captions": Subtitles,
  "audio_lines": Music2,
  "audio-lines": Music2,
  "mic": Mic,
  "music": Music,
  "thumbs_up": ThumbsUp,
  "thumbs-up": ThumbsUp,
  "list_video": List,
  "list-video": List,
  "shield_check": ShieldCheck,
  "shield-check": ShieldCheck,
  "lock": Lock,
  "terminal": Terminal,
  "network": Network,
  "globe": Globe,
  "user_search": Search,
  "search": Search,
  "shield": Shield,
  "gauge": Gauge,
  "sparkles": Sparkles,
  "layers": LayersIcon,
  "check": Check,
  "x": X,
  "chevron_left": ChevronLeft,
  "chevron-left": ChevronLeft,
  "arrow_right": ArrowRight,
  "arrow-right": ArrowRight,
  "download": Download,
  "upload": Upload,
  "user": User,
  "trash": Trash2,
  "info": Info,
  "menu": MoreHorizontal,
  "refresh_cw": RefreshCw,
};

// Fallback: try to resolve camelCase/kebab variations automatically
function resolveIcon(name: string) {
  const direct = ICON_MAP[name];
  if (direct) return direct;
  // Try underscore → hyphen
  const hyphen = ICON_MAP[name.replace(/_/g, "-")];
  if (hyphen) return hyphen;
  // Try hyphen → underscore
  const under = ICON_MAP[name.replace(/-/g, "_")];
  if (under) return under;
  return Code; // fallback
}

// Fake Subtitles component for "captions"
function Subtitles({ size = 20, strokeWidth = 2, color }: { size?: number; strokeWidth?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M8 10h4M8 14h8"/>
    </svg>
  );
}

interface ToolIconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ToolIcon({ name, size = 20, strokeWidth = 2, color }: ToolIconProps) {
  const Icon = resolveIcon(name);
  return <Icon size={size} strokeWidth={strokeWidth} color={color} />;
}
