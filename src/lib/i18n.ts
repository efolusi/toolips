/**
 * The landing page and the shared chrome, in the two languages Toolips sells in.
 *
 * SCOPE IS DELIBERATE. The hub landing page, the chrome around it (nav, footer,
 * hub grid, metadata), pricing, sign-in, the 404, the docs page, and the blog
 * CHROME (index, labels, newsletter, post furniture) are translated. The 83
 * tool pages stay English for now, and so do the written BODIES of blog posts:
 * a post's prose is content, not chrome, and translating it is an editorial
 * decision rather than a dictionary entry. Translating them later costs the
 * same; translating them badly now has to be undone first.
 *
 * NUMBERS NEVER LIVE HERE. Every measured figure the copy quotes comes from
 * src/lib/site-facts.ts and arrives as a {count}, {limit} or {price} token, so a
 * translation cannot quietly change what the page claims about the product.
 */

export const LOCALES = ["en", "id"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** The cookie that remembers a reader's choice. Read by middleware.ts. */
export const LANG_COOKIE = "lang";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "id";
}

export interface Dictionary {
  /** The `lang` attribute on <html>, and the OpenGraph locale beside it. */
  htmlLang: string;
  ogLocale: string;
  meta: {
    title: string;
    /** Carries {count}. */
    description: string;
  };
  nav: {
    tools: string;
    pricing: string;
    api: string;
    docs: string;
    blog: string;
    goPro: string;
    goProAria: string;
    signIn: string;
    /** Carries {email}. */
    accountAria: string;
    openMenu: string;
    /** First Tab stop on every page; jumps past the header to <main id="main">. */
    skipToContent: string;
    /**
     * The switch to the other language: the two-letter label a reader sees and
     * the accessible name, both written IN the language being switched to, so
     * the link makes sense to the person who needs it.
     */
    otherLanguage: string;
    otherLanguageAria: string;
  };
  hero: {
    /** Proof line under the search. Carries {free} and {pro}. */
    eyebrow: string;
    /** [lead, emphasised word, trail]; the middle part renders in italic accent. */
    title: string[];
    /** Carries {count}. */
    lead: string;
    /** Carries {count}. */
    searchPlaceholder: string;
    searchAria: string;
    browse: string;
  };
  grid: {
    /** [lead, emphasised word, trail]. */
    title: string[];
    lede: string;
    /** Carries {count} — the number of tools matching the current filter. */
    resultCount: string;
    emptyTitle: string;
    emptyBody: string;
    emptyFor: string;
    clearSearch: string;
  };
  ways: {
    /** [lead, emphasised word, trail]. */
    title: string[];
    lede: string;
    web: { title: string; body: string; cta: string };
    api: { title: string; body: string; cta: string };
    mcp: { title: string; body: string; cta: string };
  };
  upgrade: {
    /** Carries {limit}. */
    title: string;
    body: string;
    /** Carries {price}. */
    cta: string;
  };
  /** Shown once after an account deletion redirects back to the hub. */
  accountDeleted: string;
  /**
   * The small chrome around a tool page: breadcrumb, tier badge, the free-limit
   * note and the pro gate. The tool's own name and description come from the
   * catalog via src/lib/tool-copy.ts, not from here.
   */
  toolPage: {
    notFoundTitle: string;
    backToTools: string;
    breadcrumbTools: string;
    goPro: string;
    badgeFree: string;
    badgePro: string;
    /** The free note renders as pre + linked goPro text + post. */
    freeNotePre: string;
    freeNoteLink: string;
    freeNotePost: string;
    proFeature: string;
    proRequires: string;
    /** Carries {price}. */
    proCta: string;
    /** A catalog tool that is planned but cannot run yet. */
    comingSoonBadge: string;
    comingSoonTitle: string;
    comingSoonBody: string;
    /** A catalog tool that is switched off on purpose for now. */
    suspendedBadge: string;
    suspendedTitle: string;
    suspendedBody: string;
  };
  pricing: {
    metaTitle: string;
    /** Carries {price}. */
    metaDescription: string;
    flashCanceled: string;
    flashCardUnavailable: string;
    flashCryptoUnavailable: string;
    flashError: string;
    eyebrow: string;
    /** One line per rule; rendered with <br> between them. */
    title: string[];
    lead: string;
    monthly: string;
    yearly: string;
    /** Carries {pct}. */
    saveAnnual: string;
    switchYearly: string;
    freeBadge: string;
    freeHeading: string;
    freeTagline: string;
    /** Carry {free}, {exports}, {mb}: see PRICING_FACTS. */
    freeFeatures: string[];
    browseTools: string;
    mostPopular: string;
    proBadge: string;
    proHeading: string;
    perMonthYearly: string;
    perMonthMonthly: string;
    /** Carry {batch}: see PRICING_FACTS. Only claims the code backs. */
    proFeatures: string[];
    /** The paid checkout button. Pay charges the first period immediately. */
    subscribe: string;
    payCrypto: string;
    faqTitle: string;
    /** Answers may carry {days}, the refund window. */
    faq: { q: string; a: string }[];
  };
  signIn: {
    /** Carries {count}. */
    eyebrow: string;
    /** Three lines; the last one is rendered in gold. */
    title: string[];
    heroLead: string;
    formTitle: string;
    formLead: string;
    cta: string;
    ctaBusy: string;
    errorFallback: string;
    footnote: string;
  };
  notFound: {
    /** document.title of the 404, already carrying the brand. */
    metaTitle: string;
    /** Carries {code}. */
    eyebrow: string;
    /** Two lines; the second one is rendered in color. */
    title: string[];
    lead: string;
    backHome: string;
    readDocs: string;
  };
  docs: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    /** Three lines; the middle one is rendered in color. */
    title: string[];
    lead: string;
    /**
     * The three entry-point cards. The api body carries a literal `{name}`
     * placeholder on purpose — it names the URL segment, not a fill token —
     * so card bodies are rendered without fill().
     */
    cards: {
      web: { eyebrow: string; title: string; body: string };
      api: { eyebrow: string; title: string; body: string };
      mcp: { eyebrow: string; title: string; body: string };
    };
    open: string;
    referenceTitle: string;
    reference: {
      auth: { title: string; items: { name: string; desc: string }[] };
      /** Item descs may carry {count} and {status}. */
      tools: { title: string; items: { name: string; desc: string }[] };
      /** Item names/descs may carry {limit} and {xpay}. */
      limits: { title: string; items: { name: string; desc: string }[] };
    };
    sampleTitle: string;
  };
  blog: {
    metaTitle: string;
    metaDescription: string;
    /** Both carry {count}. */
    postCount: string;
    postCountOne: string;
    title: string;
    lead: string;
    /** Display labels only — post data keeps its English category values. */
    categories: { all: string; engineering: string; design: string; product: string; changelog: string };
    featured: string;
    /** Both carry {min}. */
    minRead: string;
    minShort: string;
    emptyCategory: string;
    newsletter: {
      title: string;
      lead: string;
      emailPlaceholder: string;
      subscribe: string;
      subscribed: string;
      invalid: string;
      ratelimited: string;
      toolarge: string;
      error: string;
    };
    post: {
      notFoundTitle: string;
      authorBio: string;
      keepReading: string;
      share: string;
      copied: string;
    };
  };
  /**
   * Metadata for the pages whose BODY is still English only (privacy, terms,
   * status). The title and description follow the URL's language; the body is
   * marked lang="en" and introduced by `englishOnly` when the page is not.
   */
  legal: {
    privacyTitle: string;
    privacyDescription: string;
    termsTitle: string;
    termsDescription: string;
    statusTitle: string;
    statusDescription: string;
    /** Empty in English: there is nothing to explain. */
    englishOnly: string;
  };
  footer: {
    blog: string;
    docs: string;
    api: string;
    pricing: string;
    privacy: string;
    terms: string;
    status: string;
    productBy: string;
    tagline: string;
    colProduct: string;
    colResources: string;
    colLegal: string;
    rights: string;
  };
}

const en: Dictionary = {
  htmlLang: "en",
  ogLocale: "en_US",
  meta: {
    title: "Toolips · Everyday tools for files, text and the web",
    description:
      "{count} small tools in one place: merge a PDF, resize an image, format JSON, check a domain. Most are free and work without an account.",
  },
  nav: {
    tools: "Tools",
    pricing: "Pricing",
    api: "API",
    docs: "Docs",
    blog: "Blog",
    goPro: "Go Pro",
    goProAria: "Go Pro",
    signIn: "Sign in",
    accountAria: "Account · {email}",
    openMenu: "Open menu",
    skipToContent: "Skip to content",
    otherLanguage: "ID",
    otherLanguageAria: "Baca dalam Bahasa Indonesia",
  },
  hero: {
    eyebrow: "{free} free tools · {pro} on Pro · most work without an account",
    title: ["Small tools for ", "everyday", " internet tasks."],
    lead: "Merge a PDF, resize an image, format JSON or check a domain's TLS. {count} tools in one place, most of them free.",
    searchPlaceholder: "Search {count} tools…",
    searchAria: "Search tools (⌘K)",
    browse: "Browse tools",
  },
  grid: {
    title: ["Every tool, ", "one", " place."],
    lede: "Filter by category or search by name. Free tools have a daily limit; Pro tools need a subscription.",
    resultCount: "{count} tools",
    emptyTitle: "No matches.",
    emptyBody: "Try a broader search or pick a different category.",
    emptyFor: "No tool matches “{query}”.",
    clearSearch: "Clear search",
  },
  ways: {
    title: ["The same tools, ", "three", " ways."],
    lede: "Use them in the browser, call them over REST, or mount them in an MCP-aware agent. Auth and quotas are shared.",
    web: { title: "In the browser", body: "Open a tool and run it. Most tools need no account.", cta: "Browse tools" },
    api: { title: "REST API", body: "POST JSON to the same handlers the web app uses, with your API key.", cta: "Get an API key" },
    mcp: { title: "MCP server", body: "Mount the toolset in Claude, Cursor or any agent that speaks MCP.", cta: "Read the docs" },
  },
  upgrade: {
    title: "Need more than {limit} exports a day?",
    body: "Pro removes the daily caps and adds AI tools and batch processing.",
    cta: "See Pro · ${price}/mo",
  },
  accountDeleted:
    "Your account was deleted. Sorry to see you go. You're always welcome back.",
  toolPage: {
    notFoundTitle: "Tool not found · Toolips",
    backToTools: "Back to Tools",
    breadcrumbTools: "Tools",
    goPro: "Go Pro",
    badgeFree: "Free",
    badgePro: "Pro",
    freeNotePre: "Free includes a daily run limit per tool category.",
    freeNoteLink: "Go Pro",
    freeNotePost: "for unlimited.",
    proFeature: "Pro feature",
    proRequires: "This tool requires a Pro subscription.",
    proCta: "Go Pro · from ${price}/mo",
    comingSoonBadge: "Coming soon",
    comingSoonTitle: "Not available yet",
    comingSoonBody: "This tool is on the way but does not run yet. Every other tool in the catalog works today.",
    suspendedBadge: "Paused",
    suspendedTitle: "Temporarily unavailable",
    suspendedBody: "Downloaders are paused for now. Every other tool in the catalog works today.",
  },
  pricing: {
    metaTitle: "Pricing · Toolips",
    metaDescription:
      "Free for everyone. Pro unlocks AI tools and batch processing, and lifts the daily caps, from ${price}/mo.",
    flashCanceled: "Checkout canceled. No charge was made.",
    flashCardUnavailable: "Card payments aren't available right now. Try crypto, or check back shortly.",
    flashCryptoUnavailable: "Crypto checkout isn't available right now. Try paying by card.",
    flashError: "Something went wrong starting checkout. Please try again.",
    eyebrow: "Free, forever · Pro for power moves",
    title: ["One price.", "No nonsense."],
    lead: "Toolips is free for everyone. Pro unlocks AI tools and batch processing, and lifts the daily caps, all for less than a coffee.",
    monthly: "Monthly",
    yearly: "Yearly",
    saveAnnual: "Save {pct}% on annual",
    switchYearly: "Switch to yearly any time",
    freeBadge: "Free",
    freeHeading: "Forever free.",
    freeTagline: "No card. No signup.",
    freeFeatures: [
      "{free} free tools",
      "{exports} PDF/image exports per day",
      "Files up to {mb} MB each",
    ],
    browseTools: "Browse tools",
    mostPopular: "Most popular",
    proBadge: "Pro",
    proHeading: "Power move.",
    perMonthYearly: "per month · billed yearly",
    perMonthMonthly: "per month · billed monthly",
    proFeatures: [
      "Everything in Free",
      "Unlimited exports",
      "Batch resize up to {batch} images at once",
      "AI tools (Paraphraser, Hooks, …)",
      "REST API and MCP with no daily cap",
    ],
    subscribe: "Get Pro",
    payCrypto: "Pay with crypto",
    faqTitle: "Common questions",
    faq: [
      {
        q: "Can I cancel any time?",
        a: "Yep. Cancel from your account in two clicks. You keep Pro until the billing period ends.",
      },
      {
        q: "Is there a refund policy?",
        a: "Full refund within {days} days, no questions asked. After {days} days we prorate the unused time if you cancel. Just email hello@toolips.xyz.",
      },
      {
        q: "Do team plans exist?",
        a: "Team billing (centralized seats, shared workspace) and SSO are on the roadmap, but not available yet. Email team@toolips.xyz to join the waiting list.",
      },
    ],
  },
  signIn: {
    eyebrow: "{count} tools · zero installs",
    title: ["Pick up", "where you", "left off."],
    heroLead:
      "Sign in for your API key, billing, and saved account settings. Toolips works without an account too, so it's your call.",
    formTitle: "Welcome back.",
    formLead:
      "Toolips uses your Efolusi account. One sign-in for every Efolusi product, with no separate password to remember here.",
    cta: "Continue with Efolusi",
    ctaBusy: "Taking you to Efolusi…",
    errorFallback: "Could not reach Efolusi sign-in.",
    footnote:
      "No account yet? Continuing creates one. Most tools work without signing in at all. An account is for your API key, billing and saved settings.",
  },
  notFound: {
    metaTitle: "Page not found · Toolips",
    eyebrow: "{code} · not found",
    title: ["This page ", "isn't", " here."],
    lead: "It may have moved, or it never existed. The tools are all still on the home page.",
    backHome: "Back to tools",
    readDocs: "Read the docs",
  },
  docs: {
    metaTitle: "Docs · Toolips",
    metaDescription: "Use Toolips from the browser, the REST API, or any MCP-compatible AI agent.",
    eyebrow: "Documentation",
    title: ["Docs.", "One page.", "No fluff."],
    lead: "Toolips runs the same tools three ways: a web app, a REST API, and an MCP server. Use whichever fits your workflow; they share auth, quotas, and output shapes.",
    cards: {
      web: {
        eyebrow: "Start here",
        title: "Quickstart",
        body: "Run your first tool from the web. Two minutes, no signup.",
      },
      api: {
        eyebrow: "Endpoints",
        title: "REST API",
        body: "POST /api/tools/{name} with JSON. Same surface as the web UI.",
      },
      mcp: {
        eyebrow: "Protocol",
        title: "MCP server",
        body: "Mount the toolset in Claude, Cursor, or any MCP-aware agent.",
      },
    },
    open: "Open",
    referenceTitle: "Reference",
    reference: {
      auth: {
        title: "Authentication",
        items: [
          { name: "Cookie session", desc: "Browser flow using an Efolusi SSO session." },
          { name: "API key", desc: "tlp_live_… header for the REST API." },
          { name: "MCP token", desc: "Same key, scoped to tools:call." },
        ],
      },
      tools: {
        title: "Tools",
        items: [
          { name: "Catalog", desc: "{count} tools across utility, security and AI." },
          { name: "I/O shape", desc: "JSON in, JSON out. File tools return a signed URL." },
          {
            name: "Errors",
            desc: "JSON error bodies: { error } with the right HTTP status ({status} carries upgradeUrl when over quota).",
          },
        ],
      },
      limits: {
        title: "Limits",
        items: [
          { name: "Free tier", desc: "Free tools only. {limit} file exports / day per IP; text tools are not metered. Per-day calendar reset." },
          { name: "Pro tier", desc: "No daily cap. Per-minute rate limits still apply." },
          {
            name: "{xpay}",
            desc: "Optional pay-per-call in USDC (no account) when an {xpay} verifier is configured.",
          },
        ],
      },
    },
    sampleTitle: "One request",
  },
  blog: {
    metaTitle: "Blog · Toolips",
    metaDescription: "Field notes from building Toolips: design, engineering, product, changelog.",
    postCount: "{count} posts",
    postCountOne: "{count} post",
    title: "Field notes.",
    lead: "Notes from building Toolips: design, engineering, and the occasional ode to a well-shrunk PDF.",
    categories: {
      all: "All",
      engineering: "Engineering",
      design: "Design",
      product: "Product",
      changelog: "Changelog",
    },
    featured: "Featured",
    minRead: "{min} min read",
    minShort: "{min} min",
    emptyCategory: "No posts in this category yet.",
    newsletter: {
      title: "One email. Monthly.",
      lead: "Field notes, changelog highlights, the occasional discount. Never more than once a month.",
      emailPlaceholder: "you@email.com",
      subscribe: "Subscribe",
      subscribed: "You're on the list. See you next month.",
      invalid: "Enter a valid email address.",
      ratelimited: "Too many attempts. Try again in a minute.",
      toolarge: "That request was too large. Try again.",
      error: "We couldn't save that signup. Please try again.",
    },
    post: {
      notFoundTitle: "Post not found · Toolips",
      authorBio: "Writes about utility software and the people who make it.",
      keepReading: "Keep reading",
      share: "Share",
      copied: "Copied",
    },
  },
  legal: {
    privacyTitle: "Privacy Policy",
    privacyDescription: "How Toolips handles your data. Short and honest.",
    termsTitle: "Terms of Service",
    termsDescription: "The terms you agree to when using Toolips.",
    statusTitle: "Status",
    statusDescription: "Real-time service status for Toolips.",
    englishOnly: "",
  },
  footer: {
    blog: "Blog",
    docs: "Docs",
    api: "API",
    pricing: "Pricing",
    privacy: "Privacy",
    terms: "Terms",
    status: "Status",
    productBy: "A product by",
    tagline: "Everyday tools for files, text and the web, in one place.",
    colProduct: "Product",
    colResources: "Resources",
    colLegal: "Legal",
    rights: "All rights reserved.",
  },
};

const id: Dictionary = {
  htmlLang: "id",
  ogLocale: "id_ID",
  meta: {
    title: "Toolips · Alat sehari-hari untuk file, teks, dan web",
    description:
      "{count} alat kecil di satu tempat: gabungkan PDF, ubah ukuran gambar, rapikan JSON, periksa domain. Sebagian besar gratis dan bisa dipakai tanpa akun.",
  },
  nav: {
    tools: "Alat",
    pricing: "Harga",
    api: "API",
    docs: "Dokumen",
    blog: "Blog",
    goPro: "Ambil Pro",
    goProAria: "Ambil paket Pro",
    signIn: "Masuk",
    accountAria: "Akun · {email}",
    openMenu: "Buka menu",
    skipToContent: "Lewati ke konten",
    otherLanguage: "EN",
    otherLanguageAria: "Read in English",
  },
  hero: {
    eyebrow: "{free} alat gratis · {pro} di Pro · sebagian besar tanpa akun",
    title: ["Alat kecil untuk urusan internet ", "sehari-hari", "."],
    lead: "Gabungkan PDF, ubah ukuran gambar, rapikan JSON, atau periksa TLS sebuah domain. {count} alat di satu tempat, sebagian besar gratis.",
    searchPlaceholder: "Cari {count} alat…",
    searchAria: "Cari alat (⌘K)",
    browse: "Jelajahi alat",
  },
  grid: {
    title: ["Semua alat, ", "satu", " tempat."],
    lede: "Saring per kategori atau cari berdasarkan nama. Alat gratis punya batas harian; alat Pro memerlukan langganan.",
    resultCount: "{count} alat",
    emptyTitle: "Tidak ada yang cocok.",
    emptyBody: "Coba kata kunci yang lebih luas, atau pilih kategori lain.",
    emptyFor: "Tidak ada alat yang cocok dengan “{query}”.",
    clearSearch: "Bersihkan pencarian",
  },
  ways: {
    title: ["Alat yang sama, ", "tiga", " cara."],
    lede: "Pakai di browser, panggil lewat REST, atau pasang di agen yang mendukung MCP. Autentikasi dan kuotanya sama.",
    web: { title: "Di browser", body: "Buka alat lalu jalankan. Sebagian besar alat tidak perlu akun.", cta: "Jelajahi alat" },
    api: { title: "REST API", body: "Kirim JSON ke handler yang sama dengan aplikasi web, memakai kunci API Anda.", cta: "Buat kunci API" },
    mcp: { title: "Server MCP", body: "Pasang toolset ini di Claude, Cursor, atau agen lain yang mendukung MCP.", cta: "Baca dokumen" },
  },
  upgrade: {
    title: "Butuh lebih dari {limit} ekspor sehari?",
    body: "Pro menghapus batas harian dan menambah alat AI serta pemrosesan batch.",
    cta: "Lihat Pro · ${price}/bln",
  },
  accountDeleted:
    "Akun Anda sudah dihapus. Sayang sekali harus berpisah. Anda selalu boleh kembali.",
  toolPage: {
    notFoundTitle: "Alat tidak ditemukan · Toolips",
    backToTools: "Kembali ke Alat",
    breadcrumbTools: "Alat",
    goPro: "Ambil Pro",
    badgeFree: "Gratis",
    badgePro: "Pro",
    freeNotePre: "Gratis punya batas pemakaian harian per kategori alat.",
    freeNoteLink: "Ambil Pro",
    freeNotePost: "untuk tanpa batas.",
    proFeature: "Fitur Pro",
    proRequires: "Alat ini membutuhkan langganan Pro.",
    proCta: "Ambil Pro · mulai ${price}/bln",
    comingSoonBadge: "Segera hadir",
    comingSoonTitle: "Belum tersedia",
    comingSoonBody: "Alat ini sedang disiapkan dan belum bisa dijalankan. Semua alat lain di katalog sudah bisa dipakai hari ini.",
    suspendedBadge: "Dijeda",
    suspendedTitle: "Sementara tidak tersedia",
    suspendedBody: "Alat pengunduh sedang dijeda untuk saat ini. Semua alat lain di katalog tetap bisa dipakai hari ini.",
  },
  pricing: {
    metaTitle: "Harga · Toolips",
    metaDescription:
      "Gratis untuk semua. Pro membuka alat AI dan pemrosesan batch, serta menghapus batas harian, mulai ${price}/bln.",
    flashCanceled: "Checkout dibatalkan. Tidak ada tagihan yang dibuat.",
    flashCardUnavailable: "Pembayaran kartu sedang tidak tersedia. Coba kripto, atau cek lagi sebentar lagi.",
    flashCryptoUnavailable: "Checkout kripto sedang tidak tersedia. Coba bayar pakai kartu.",
    flashError: "Ada yang salah saat memulai checkout. Silakan coba lagi.",
    eyebrow: "Gratis, selamanya · Pro buat yang serius",
    title: ["Satu harga.", "Tanpa ribet."],
    lead: "Toolips gratis untuk semua. Pro membuka alat AI dan pemrosesan batch, serta menghapus batas harian, semuanya lebih murah dari secangkir kopi.",
    monthly: "Bulanan",
    yearly: "Tahunan",
    saveAnnual: "Hemat {pct}% dengan paket tahunan",
    switchYearly: "Bisa pindah ke tahunan kapan saja",
    freeBadge: "Gratis",
    freeHeading: "Gratis selamanya.",
    freeTagline: "Tanpa kartu. Tanpa daftar.",
    freeFeatures: [
      "{free} alat gratis",
      "{exports} ekspor PDF/gambar per hari",
      "File sampai {mb} MB per file",
    ],
    browseTools: "Jelajahi alat",
    mostPopular: "Paling laris",
    proBadge: "Pro",
    proHeading: "Naik kelas.",
    perMonthYearly: "per bulan (USD) · ditagih tahunan",
    perMonthMonthly: "per bulan (USD) · ditagih bulanan",
    proFeatures: [
      "Semua yang ada di Gratis",
      "Ekspor tanpa batas",
      "Ubah ukuran sampai {batch} gambar sekaligus",
      "Alat AI (Paraphraser, Hooks, …)",
      "REST API dan MCP tanpa batas harian",
    ],
    subscribe: "Ambil Pro",
    payCrypto: "Bayar pakai kripto",
    faqTitle: "Pertanyaan umum",
    faq: [
      {
        q: "Bisa batal kapan saja?",
        a: "Bisa. Batalkan dari akunmu dalam dua klik. Pro tetap aktif sampai periode tagihan berakhir.",
      },
      {
        q: "Ada kebijakan refund?",
        a: "Refund penuh dalam {days} hari, tanpa banyak tanya. Lewat {days} hari, sisa waktu yang belum terpakai kami prorata kalau kamu batal. Cukup email hello@toolips.xyz.",
      },
      {
        q: "Ada paket tim?",
        a: "Tagihan tim (kursi terpusat, workspace bersama) dan SSO ada di roadmap, tapi belum tersedia. Email team@toolips.xyz untuk ikut waiting list.",
      },
    ],
  },
  signIn: {
    eyebrow: "{count} alat · tanpa instal",
    title: ["Lanjutkan", "dari titik", "terakhir."],
    heroLead:
      "Masuk untuk kunci API, tagihan, dan pengaturan akun yang tersimpan. Toolips juga jalan tanpa akun, jadi terserah kamu.",
    formTitle: "Selamat datang kembali.",
    formLead:
      "Toolips memakai akun Efolusi kamu. Sekali masuk untuk semua produk Efolusi, tanpa password terpisah yang perlu diingat.",
    cta: "Lanjutkan dengan Efolusi",
    ctaBusy: "Mengantar kamu ke Efolusi…",
    errorFallback: "Tidak bisa menghubungi halaman masuk Efolusi.",
    footnote:
      "Belum punya akun? Melanjutkan akan membuatkannya. Kebanyakan alat jalan tanpa perlu masuk sama sekali. Akun hanya untuk kunci API, tagihan, dan pengaturan tersimpan.",
  },
  notFound: {
    metaTitle: "Halaman tidak ditemukan · Toolips",
    eyebrow: "{code} · tidak ditemukan",
    title: ["Halaman ini ", "tidak", " ada."],
    lead: "Mungkin sudah dipindah, atau memang tidak pernah ada. Semua alat masih ada di beranda.",
    backHome: "Kembali ke alat",
    readDocs: "Baca dokumen",
  },
  docs: {
    metaTitle: "Dokumen · Toolips",
    metaDescription: "Pakai Toolips dari browser, lewat REST API, atau dari agen AI mana pun yang mendukung MCP.",
    eyebrow: "Dokumentasi",
    title: ["Dokumen.", "Satu halaman.", "Tanpa basa-basi."],
    lead: "Toolips menjalankan alat yang sama lewat tiga jalur: aplikasi web, REST API, dan server MCP. Pakai yang paling pas dengan alur kerjamu; ketiganya berbagi auth, kuota, dan bentuk keluaran.",
    cards: {
      web: {
        eyebrow: "Mulai di sini",
        title: "Mulai cepat",
        body: "Jalankan alat pertamamu dari web. Dua menit, tanpa daftar.",
      },
      api: {
        eyebrow: "Endpoint",
        title: "REST API",
        body: "POST /api/tools/{name} dengan JSON. Permukaan yang sama dengan UI web.",
      },
      mcp: {
        eyebrow: "Protokol",
        title: "Server MCP",
        body: "Pasang toolset ini di Claude, Cursor, atau agen mana pun yang paham MCP.",
      },
    },
    open: "Buka",
    referenceTitle: "Referensi",
    reference: {
      auth: {
        title: "Autentikasi",
        items: [
          { name: "Sesi cookie", desc: "Alur browser dengan sesi SSO Efolusi." },
          { name: "Kunci API", desc: "Header tlp_live_… untuk REST API." },
          { name: "Token MCP", desc: "Kunci yang sama, dibatasi ke tools:call." },
        ],
      },
      tools: {
        title: "Alat",
        items: [
          { name: "Katalog", desc: "{count} alat mencakup utilitas, keamanan, dan AI." },
          { name: "Bentuk I/O", desc: "JSON masuk, JSON keluar. Alat file mengembalikan signed URL." },
          {
            name: "Error",
            desc: "Body error JSON: { error } dengan status HTTP yang tepat ({status} membawa upgradeUrl saat kuota terlampaui).",
          },
        ],
      },
      limits: {
        title: "Batas",
        items: [
          { name: "Tingkat gratis", desc: "Hanya alat gratis. {limit} ekspor file / hari per IP; alat teks tidak dibatasi. Reset per hari kalender." },
          { name: "Tingkat Pro", desc: "Tanpa batas harian. Batas laju per menit tetap berlaku." },
          {
            name: "{xpay}",
            desc: "Opsi bayar per panggilan dalam USDC (tanpa akun) bila verifier {xpay} sudah dikonfigurasi.",
          },
        ],
      },
    },
    sampleTitle: "Satu permintaan",
  },
  blog: {
    metaTitle: "Blog · Toolips",
    metaDescription: "Catatan lapangan dari membangun Toolips: desain, engineering, produk, changelog.",
    postCount: "{count} tulisan",
    postCountOne: "{count} tulisan",
    title: "Catatan lapangan.",
    lead: "Catatan dari membangun Toolips: desain, engineering, dan sesekali puja-puji untuk PDF yang menyusut sempurna.",
    categories: {
      all: "Semua",
      engineering: "Engineering",
      design: "Desain",
      product: "Produk",
      changelog: "Changelog",
    },
    featured: "Unggulan",
    minRead: "{min} mnt baca",
    minShort: "{min} mnt",
    emptyCategory: "Belum ada tulisan di kategori ini.",
    newsletter: {
      title: "Satu email. Sebulan sekali.",
      lead: "Catatan lapangan, sorotan changelog, sesekali diskon. Tidak pernah lebih dari sekali sebulan.",
      emailPlaceholder: "kamu@email.com",
      subscribe: "Langganan",
      subscribed: "Kamu sudah masuk daftar. Sampai jumpa bulan depan.",
      invalid: "Masukkan alamat email yang valid.",
      ratelimited: "Terlalu banyak percobaan. Coba lagi semenit lagi.",
      toolarge: "Permintaan itu terlalu besar. Coba lagi.",
      error: "Pendaftaran belum tersimpan. Silakan coba lagi.",
    },
    post: {
      notFoundTitle: "Tulisan tidak ditemukan · Toolips",
      authorBio: "Menulis tentang software utilitas dan orang-orang di baliknya.",
      keepReading: "Lanjut membaca",
      share: "Bagikan",
      copied: "Tersalin",
    },
  },
  legal: {
    privacyTitle: "Kebijakan Privasi",
    privacyDescription: "Cara Toolips menangani data Anda. Singkat dan jujur.",
    termsTitle: "Ketentuan Layanan",
    termsDescription: "Ketentuan yang Anda setujui saat memakai Toolips.",
    statusTitle: "Status Layanan",
    statusDescription: "Status layanan Toolips secara langsung.",
    englishOnly: "Halaman ini untuk saat ini hanya tersedia dalam bahasa Inggris.",
  },
  footer: {
    blog: "Blog",
    docs: "Dokumen",
    api: "API",
    pricing: "Harga",
    privacy: "Privasi",
    terms: "Ketentuan",
    status: "Status",
    productBy: "Produk dari",
    tagline: "Alat sehari-hari untuk file, teks, dan web, di satu tempat.",
    colProduct: "Produk",
    colResources: "Sumber",
    colLegal: "Legal",
    rights: "Hak cipta dilindungi.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, id };

/** The dictionary for a locale, falling back to English for anything unknown. */
export function dictionaryFor(value: string | undefined | null): Dictionary {
  return dictionaries[isLocale(value) ? value : DEFAULT_LOCALE];
}

/**
 * The locale for a single-route page (/pricing, /sign-in, the 404), which has
 * no /en//id prefix to say which language it is in.
 *
 * Same order as the middleware's guess for "/": an explicit stored choice wins,
 * otherwise Cloudflare's edge-resolved country decides, otherwise English. Kept
 * as a pure function of the two inputs so server components can call it with
 * whatever request API they have (cookies()/headers()) and tests with strings.
 */
export function resolveLocale(
  cookieValue: string | undefined | null,
  cfCountry: string | undefined | null,
): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  return cfCountry === "ID" ? "id" : DEFAULT_LOCALE;
}

/** The landing path for a locale, used by the language switch and canonicals. */
export function landingPath(locale: Locale): string {
  return `/${locale}`;
}

/** The locale a reader is NOT on, which is the one the header link offers. */
export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "id" : "en";
}
