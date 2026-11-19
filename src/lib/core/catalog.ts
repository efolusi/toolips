// Canonical Toolips tool catalog (83 entries) (FR-1.1). Single source of truth
// for "which tools exist" across the whole product: the web hub UI imports it
// (via apps/web/src/lib/tools.ts, a thin re-export), and scripts/check-catalog.mjs
// asserts the server registries (packages/tools-*) and README counts against it.
//
// Entries carry both identity (id, name, category, surface) and the UI
// presentation the hub needs (icon, block, tier, desc). Server tool handlers
// live in the tools-* packages as ToolDefs and are cross-checked against this
// list by CI — they are NOT duplicated here.
//
// `surface` here is the UI presentation surface (how the hub renders the tool),
// distinct from ToolDef's execution surface in ./index.ts.

export type ToolSurface = "file" | "text" | "url" | "generator" | "code" | "compare" | "result";
export type ToolTier = "free" | "pro";
/**
 * "coming-soon" keeps a planned tool's page and URL alive while keeping it out
 * of everything that offers tools to run: the hub, the counts, the sitemap.
 * "suspended" does the same for a tool that used to run and is switched off
 * on purpose; its page says so instead of promising it is on the way.
 * Absent means runnable.
 */
export type ToolStatus = "coming-soon" | "suspended";

/**
 * The downloader family (every tool in the Download category) is switched off
 * for now: pulling media from third-party platforms exposes Toolips to those
 * platforms' terms and to copyright claims. Flipping this to false restores
 * the hub tiles, the pages, the API job route and the MCP tool in one change;
 * the implementation stays in packages/tools-download untouched.
 */
export const DOWNLOADERS_SUSPENDED = true;
export type Tool = {
  id: string;
  name: string;
  icon: string;
  block: 1 | 2 | 3;
  tier: ToolTier;
  category: string;
  surface: ToolSurface;
  desc: string;
  status?: ToolStatus;
};
export type Category = {
  name: string;
  block: 1 | 2 | 3 | null;
  count: number;
};

export const TOOLS: Tool[] = [
  // PDF (7) · block 3
  { id: "merge-pdf",          name: "Merge PDF",               icon: "merge",        block: 3, tier: "free", category: "PDF",       surface: "file",      desc: "Combine multiple PDFs into one unified document." },
  { id: "split-pdf",          name: "Split PDF",               icon: "scissors",     block: 3, tier: "free", category: "PDF",       surface: "file",      desc: "Separate pages or whole sets for easy conversion." },
  { id: "jpg-to-pdf",         name: "JPG to PDF",              icon: "file-image",   block: 3, tier: "free", category: "PDF",       surface: "file",      desc: "Convert images to a single PDF document in seconds." },
  { id: "pdf-to-jpg",         name: "PDF to JPG",              icon: "image",        block: 3, tier: "free", category: "PDF",       surface: "file",      desc: "Extract images or save each PDF page as a JPG." },
  { id: "compress-pdf",       name: "Compress PDF",            icon: "minimize-2",   block: 3, tier: "free", category: "PDF",       surface: "file",      desc: "Reduce the size of your PDF documents instantly." },
  { id: "rotate-pdf",         name: "Rotate PDF",              icon: "rotate-cw",    block: 3, tier: "free", category: "PDF",       surface: "file",      desc: "Rotate your PDFs the way you need them." },
  { id: "watermark-pdf",      name: "Watermark PDF",           icon: "stamp",        block: 3, tier: "free", category: "PDF",       surface: "file",      desc: "Add a custom text watermark across your PDF pages." },

  // Image (9) · block 1
  { id: "image-compressor",   name: "Image Compressor",        icon: "minimize-2",   block: 1, tier: "free", category: "Image",     surface: "file",      desc: "Compress JPG, PNG, or GIF images easily." },
  { id: "resize-image",       name: "Resize Image",            icon: "maximize",     block: 1, tier: "free", category: "Image",     surface: "file",      desc: "Define your dimensions by pixels or percentages." },
  { id: "image-converter",    name: "Image Converter",         icon: "refresh-cw",   block: 1, tier: "free", category: "Image",     surface: "file",      desc: "Convert images to JPG, PNG, WebP, or AVIF." },
  { id: "crop-image",         name: "Crop Image",              icon: "crop",         block: 1, tier: "free", category: "Image",     surface: "file",      desc: "Crop images with interactive aspect ratios." },
  { id: "rotate-image",       name: "Rotate Image",            icon: "rotate-cw",    block: 1, tier: "free", category: "Image",     surface: "file",      desc: "Rotate images easily to any angle." },
  { id: "watermark-image",    name: "Watermark Image",         icon: "stamp",        block: 1, tier: "free", category: "Image",     surface: "file",      desc: "Stamp text over your images in seconds." },
  { id: "image-ocr",          name: "Image to Text (OCR)",     icon: "scan-text",    block: 1, tier: "pro",  category: "Image",     surface: "file",      desc: "Extract text from images using high-quality OCR." },
  { id: "batch-resize",       name: "Batch Resize",            icon: "grid",         block: 1, tier: "pro",  category: "Image",     surface: "file",      desc: "Resize multiple images at once, download as ZIP." },
  { id: "grayscale-image",    name: "Grayscale Image",         icon: "contrast",     block: 1, tier: "free", category: "Image",     surface: "file",      desc: "Convert your colored images to black and white." },

  // Color (3) · block 2
  { id: "palette-gen",        name: "Color Palette Generator", icon: "palette",      block: 2, tier: "free", category: "Color",     surface: "generator", desc: "Generate harmonious palettes from any base color." },
  { id: "palette-extract",    name: "Color Palette Extractor", icon: "droplet",      block: 2, tier: "free", category: "Color",     surface: "file",      desc: "Extract dominant colors from any image as HEX + RGB." },
  { id: "color-converter",    name: "Color Converter",         icon: "pipette",      block: 2, tier: "free", category: "Color",     surface: "text",      desc: "Convert colors between HEX, RGB, and HSL." },

  // Text (10) · block 1
  { id: "word-counter",       name: "Word Counter",            icon: "hash",         block: 1, tier: "free", category: "Text",      surface: "text",      desc: "Count words, characters, sentences in real time." },
  { id: "character-counter",  name: "Character Counter",       icon: "type",         block: 1, tier: "free", category: "Text",      surface: "text",      desc: "Count and analyze the characters in your text." },
  { id: "case-converter",     name: "Case Converter",          icon: "case-upper",   block: 1, tier: "free", category: "Text",      surface: "text",      desc: "UPPER, lower, Title, Sentence: convert any case." },
  { id: "text-cleaner",       name: "Text Cleaner",            icon: "eraser",       block: 1, tier: "free", category: "Text",      surface: "text",      desc: "Remove extra spaces, empty lines, junk characters." },
  { id: "remove-duplicates",  name: "Remove Duplicate Lines",  icon: "copy",         block: 1, tier: "free", category: "Text",      surface: "text",      desc: "Clean up your lists by removing duplicates." },
  { id: "line-counter",       name: "Line Counter",            icon: "list",         block: 1, tier: "free", category: "Text",      surface: "text",      desc: "Count the number of lines in your text content." },
  { id: "slug-gen",           name: "Slug Generator",          icon: "link",         block: 1, tier: "free", category: "Text",      surface: "text",      desc: "Generate SEO-friendly URL slugs from text." },
  { id: "lorem-ipsum",        name: "Lorem Ipsum",             icon: "align-left",   block: 1, tier: "free", category: "Text",      surface: "generator", desc: "Generate placeholder text for your designs." },
  { id: "paraphraser",        name: "Paraphraser",             icon: "shuffle",      block: 1, tier: "pro",  category: "Text",      surface: "text",      desc: "AI-powered rewriting in multiple tones." },
  { id: "grammar-checker",    name: "Grammar Checker",         icon: "spell-check",  block: 1, tier: "pro",  category: "Text",      surface: "text",      desc: "Check spelling and grammar with instant suggestions." },

  // Developer (12) · block 3
  { id: "markdown-to-html",   name: "Markdown to HTML",        icon: "code",         block: 3, tier: "free", category: "Developer", surface: "code",      desc: "Preview and convert Markdown into raw HTML." },
  { id: "html-formatter",     name: "HTML Formatter",          icon: "code",         block: 3, tier: "free", category: "Developer", surface: "code",      desc: "Prettify and properly indent your HTML code." },
  { id: "css-minifier",       name: "CSS Minifier",            icon: "minimize-2",   block: 3, tier: "free", category: "Developer", surface: "code",      desc: "Compress CSS to improve site performance." },
  { id: "diff-checker",       name: "Diff Checker",            icon: "diff",         block: 3, tier: "free", category: "Developer", surface: "compare",   desc: "Compare two texts and highlight what changed." },
  { id: "word-diff",          name: "Word Diff",               icon: "diff",         block: 3, tier: "free", category: "Developer", surface: "compare",   desc: "Compare texts word-by-word, inline highlights." },
  { id: "regex-tester",       name: "Regex Tester",            icon: "regex",        block: 3, tier: "free", category: "Developer", surface: "code",      desc: "Write and test regex with live match highlighting." },
  { id: "js-beautifier",      name: "JS Beautifier",           icon: "braces",       block: 3, tier: "free", category: "Developer", surface: "code",      desc: "Format messy JS for readability, or minify it." },
  { id: "svg-optimizer",      name: "SVG Optimizer",           icon: "feather",      block: 3, tier: "free", category: "Developer", surface: "code",      desc: "Strip metadata and whitespace from SVG files." },
  { id: "code-screenshot",    name: "Code Screenshot",         icon: "camera",       block: 3, tier: "pro",  category: "Developer", surface: "code",      desc: "Beautiful code snippet images for social." },
  { id: "json-formatter",     name: "JSON Formatter",          icon: "braces",       block: 3, tier: "free", category: "Developer", surface: "code",      desc: "Prettify or minify your JSON data." },
  { id: "json-to-csv",        name: "JSON to CSV",             icon: "table",        block: 3, tier: "free", category: "Developer", surface: "code",      desc: "Convert a JSON array into a CSV spreadsheet." },
  { id: "csv-json",           name: "CSV ↔ JSON",              icon: "arrow-left-right", block: 3, tier: "free", category: "Developer", surface: "code",  desc: "Convert CSV to JSON or JSON to CSV instantly." },

  // Generators / Utilities (6) · block 2
  { id: "qr-gen",             name: "QR Code Generator",       icon: "qr-code",      block: 2, tier: "free", category: "Generator", surface: "generator", desc: "Create custom QR codes for URLs and text." },
  { id: "password-gen",       name: "Password Generator",      icon: "key",          block: 2, tier: "free", category: "Generator", surface: "generator", desc: "Create secure, random passwords instantly." },
  { id: "uuid-gen",           name: "UUID Generator",          icon: "fingerprint",  block: 2, tier: "free", category: "Generator", surface: "generator", desc: "Generate unique universal identifiers." },
  { id: "base64",             name: "Base64 Encode/Decode",    icon: "binary",       block: 2, tier: "free", category: "Generator", surface: "text",      desc: "Easily encode or decode data to/from Base64." },
  { id: "url-encoder",        name: "URL Encoder/Decoder",     icon: "link",         block: 2, tier: "free", category: "Generator", surface: "text",      desc: "Encode or decode URLs for safe transmission." },
  { id: "timestamp",          name: "Timestamp Converter",     icon: "clock",        block: 2, tier: "free", category: "Generator", surface: "text",      desc: "Convert Unix timestamps to dates and vice versa." },

  // Calculators (5) · block 2
  { id: "unit-converter",     name: "Unit Converter",          icon: "scale",        block: 2, tier: "free", category: "Calculator", surface: "generator", desc: "Convert between length, weight, volume, more." },
  { id: "percentage-calc",    name: "Percentage Calculator",   icon: "percent",      block: 2, tier: "free", category: "Calculator", surface: "generator", desc: "Calculate percentages, increases, decreases." },
  { id: "age-calc",           name: "Age Calculator",          icon: "cake",         block: 2, tier: "free", category: "Calculator", surface: "generator", desc: "Calculate exact age based on date of birth." },
  { id: "currency-format",    name: "Currency Formatter",      icon: "dollar-sign",  block: 2, tier: "free", category: "Calculator", surface: "generator", desc: "Format numbers into localized currency strings." },
  { id: "aspect-ratio",       name: "Aspect Ratio Calc",       icon: "ratio",        block: 2, tier: "free", category: "Calculator", surface: "generator", desc: "Calculate width, height, or simplified ratio." },

  // Content / AI (10) · block 1
  { id: "caption-gen",        name: "Caption Generator",       icon: "quote",        block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Generate catchy captions for social media." },
  { id: "hashtag-gen",        name: "Hashtag Generator",       icon: "hash",         block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Find the best hashtags for your content." },
  { id: "bio-gen",            name: "Bio Generator",           icon: "user-circle",  block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Create professional or creative social bios." },
  { id: "content-idea-gen",   name: "Content Idea Gen",        icon: "lightbulb",    block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Generate blog, video, and post ideas quickly." },
  { id: "hook-gen",           name: "Hook Generator",          icon: "anchor",       block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Write compelling hooks for videos and articles." },
  { id: "yt-title-gen",       name: "YouTube Title Gen",       icon: "play-circle",  block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Generate high-CTR video title ideas." },
  { id: "yt-desc-gen",        name: "YouTube Description",     icon: "captions",     block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Generate structured YouTube descriptions." },
  { id: "thumbnail-text",     name: "Thumbnail Text Gen",      icon: "image",        block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Create punchy short phrases for thumbnails." },
  { id: "tts",                name: "Text to Speech",          icon: "audio-lines",  block: 1, tier: "pro",  category: "Content",   surface: "text",      desc: "Convert text into natural-sounding voice." },
  { id: "stt",                name: "Speech to Text",          icon: "mic",          block: 1, tier: "pro",  category: "Content",   surface: "file",      desc: "Transcribe voice audio to text." },

  // Downloaders (11) · block 2
  { id: "yt-dl",              name: "YouTube Downloader",      icon: "play-circle",  block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Download a YouTube video or just its audio." },
  { id: "tiktok-dl",          name: "TikTok Downloader",       icon: "music",        block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Download TikTok videos as MP4 or MP3." },
  { id: "ig-dl",              name: "Instagram Downloader",    icon: "camera",       block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Download public Instagram reels and posts." },
  { id: "twitter-dl",         name: "Twitter / X Downloader",  icon: "feather",      block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Download videos and GIFs from X posts." },
  { id: "fb-dl",              name: "Facebook Downloader",     icon: "thumbs-up",    block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Download public Facebook videos in HD." },
  { id: "video-mp3",          name: "Video to MP3",            icon: "music",        block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Extract the audio from a supported video link as MP3." },
  { id: "audio-trim",         name: "Audio Trimmer",           icon: "scissors",     block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Set start + end, download the trimmed MP3." },
  { id: "video-transcribe",   name: "Video Transcriber",       icon: "captions",     block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Transcribe English speech from a video link, in your browser." },
  { id: "playlist-dl",        name: "Playlist Downloader",     icon: "list-video",   block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Browse and download playlist videos one by one.", status: "coming-soon" },
  { id: "subtitle-dl",        name: "Subtitle Downloader",     icon: "captions",     block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Download SRT subtitles from YouTube videos." },
  { id: "video-thumb",        name: "Thumbnail Extractor",     icon: "image",        block: 2, tier: "pro",  category: "Download",  surface: "url",       desc: "Save the full-resolution thumbnail of a supported video link." },

  // Security (10) · block 3
  { id: "security-headers",   name: "Security Headers",        icon: "shield-check", block: 3, tier: "free", category: "Security",  surface: "result",    desc: "Check HTTP security headers: CSP, HSTS, X-Frame." },
  { id: "ssl-checker",        name: "SSL / TLS Checker",       icon: "lock",         block: 3, tier: "free", category: "Security",  surface: "result",    desc: "Cert expiry, TLS version, and cipher strength." },
  { id: "http-inspector",     name: "HTTP Inspector",          icon: "terminal",     block: 3, tier: "free", category: "Security",  surface: "url",       desc: "Send custom HTTP requests, inspect raw response." },
  { id: "secret-scanner",     name: "Secret Scanner",          icon: "scan-eye",     block: 3, tier: "pro",  category: "Security",  surface: "code",      desc: "Detect leaked keys, tokens, passwords in code." },
  { id: "password-strength",  name: "Password Strength",       icon: "key",          block: 3, tier: "free", category: "Security",  surface: "text",      desc: "Strength + breach check, all local." },
  { id: "port-scanner",       name: "Port Scanner",            icon: "network",      block: 3, tier: "pro",  category: "Security",  surface: "result",    desc: "Probe common open ports (SSH, HTTP, databases)." },
  { id: "dns-lookup",         name: "DNS Lookup",              icon: "globe",        block: 3, tier: "free", category: "Security",  surface: "result",    desc: "A, AAAA, MX, TXT, CNAME, NS, SOA records." },
  { id: "whois",              name: "WHOIS Lookup",            icon: "search",       block: 3, tier: "free", category: "Security",  surface: "result",    desc: "Registrar, creation date, expiry for any domain." },
  { id: "subdomain-finder",   name: "Subdomain Finder",        icon: "search",       block: 3, tier: "pro",  category: "Security",  surface: "result",    desc: "Discover active subdomains by DNS probing." },
  { id: "cert-transparency",  name: "Cert Transparency",       icon: "shield",       block: 3, tier: "pro",  category: "Security",  surface: "result",    desc: "All SSL certificates ever issued for a domain." },
];

// Category display order + block. Counts are DERIVED from TOOLS so the two can
// never drift — the single source of truth for "which tools exist" is TOOLS.
const CATEGORY_ORDER: Array<{ name: string; block: 1 | 2 | 3 | null }> = [
  { name: "All",        block: null },
  { name: "PDF",        block: 3 },
  { name: "Image",      block: 1 },
  { name: "Color",      block: 2 },
  { name: "Text",       block: 1 },
  { name: "Developer",  block: 3 },
  { name: "Generator",  block: 2 },
  { name: "Calculator", block: 2 },
  { name: "Content",    block: 1 },
  { name: "Download",   block: 2 },
  { name: "Security",   block: 3 },
];

function countByCategory(name: string): number {
  // "All" keeps count 0 so the hub renders no badge on it (HubGrid shows a
  // badge only when count > 0), matching the prior hand-maintained table.
  if (name === "All") return 0;
  return RUNNABLE_TOOLS.filter((t) => t.category === name).length;
}

// Applied before RUNNABLE_TOOLS and CATEGORIES derive from TOOLS, so every
// consumer (hub, sitemap, counts, MCP, API) sees the same suspended state.
// A planned tool keeps "coming-soon": that is the more honest page for it.
if (DOWNLOADERS_SUSPENDED) {
  for (const tool of TOOLS) {
    if (tool.category === "Download" && tool.status === undefined) tool.status = "suspended";
  }
}

export function isRunnableTool(tool: Tool): boolean {
  return tool.status === undefined;
}

/** Every tool a reader can actually run today. Hub, counts and sitemap use this. */
export const RUNNABLE_TOOLS: Tool[] = TOOLS.filter(isRunnableTool);

export const CATEGORIES: Category[] = CATEGORY_ORDER.map((c) => ({
  ...c,
  count: countByCategory(c.name),
}));

export function toolById(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}
