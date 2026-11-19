/**
 * Every page of the site, in the two languages Toolips sells in.
 *
 * The pages, the chrome around them (header, footer, metadata) and the tool
 * pages are translated here. Two things live elsewhere: the legal documents
 * (src/lib/legal.ts, long prose with dates and addresses) and the tool names
 * and descriptions (src/lib/tool-copy.ts). Blog posts are content: a short post
 * has an Indonesian version in content/blog/id, a long one shows a note that it
 * is in English.
 *
 * NUMBERS NEVER LIVE HERE. Every measured figure the copy quotes comes from
 * src/lib/site-facts.ts and arrives as a {count}, {limit} or {price} token, so a
 * translation cannot quietly change what the page claims about the product.
 *
 * Headings that carry an accent word are three-part arrays: lead, accent, trail.
 * The accent is the one italic word the page sets in the brand colour.
 */

export const LOCALES = ["en", "id"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** The cookie that remembers a reader's choice. Read by middleware.ts. */
export const LANG_COOKIE = "lang";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "id";
}

type Accented = [string, string, string];
type Item = { name: string; desc: string };

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
    docs: string;
    blog: string;
    goPro: string;
    signIn: string;
    openMenu: string;
    closeMenu: string;
    /** First Tab stop on every page; jumps past the header to <main id="main">. */
    skipToContent: string;
    /**
     * The switch to the other language: the two-letter label a reader sees and
     * the accessible name, both written IN the language being switched to.
     */
    otherLanguage: string;
    otherLanguageAria: string;
    themeToDark: string;
    themeToLight: string;
  };
  hero: {
    /** Carries {free} and {pro}. */
    proof: string;
    title: Accented;
    /** Carries {count}. */
    lead: string;
    searchPlaceholder: string;
    searchLabel: string;
    find: string;
  };
  grid: {
    title: Accented;
    lede: string;
    resultCount: string;
    emptyTitle: string;
    emptyBody: string;
    emptyFor: string;
    clearSearch: string;
  };
  ways: {
    title: Accented;
    lede: string;
    web: { title: string; body: string; cta: string };
    api: { title: string; body: string; cta: string };
    mcp: { title: string; body: string; cta: string };
  };
  upgrade: {
    title: string;
    body: string;
    cta: string;
  };
  accountDeleted: string;
  toolPage: {
    breadcrumbTools: string;
    badgePro: string;
    /** Carries {name}. */
    run: string;
    /** Carries {name}. */
    description: string;
    limitsTitle: string;
    plan: string;
    planFree: string;
    planPro: string;
    runsIn: string;
    runsBrowser: string;
    runsServer: string;
    fileSize: string;
    fileSizeValue: string;
    batch: string;
    batchValue: string;
    mergeValue: string;
    pages: string;
    pagesValue: string;
    freeDaily: string;
    freeDailyExports: string;
    proDaily: string;
    proDailyValue: string;
    proRequires: string;
    proCta: string;
    comingSoonBadge: string;
    comingSoonTitle: string;
    comingSoonBody: string;
    suspendedBadge: string;
    suspendedTitle: string;
    suspendedBody: string;
    /** Carries {category}. */
    related: string;
  };
  pricing: {
    metaTitle: string;
    metaDescription: string;
    title: Accented;
    lead: string;
    saveAnnual: string;
    freeHeading: string;
    freeTagline: string;
    freeFeatures: string[];
    browseTools: string;
    proHeading: string;
    proTagline: string;
    perMonth: string;
    perYear: string;
    proFeatures: string[];
    subscribe: string;
    subscribeYearly: string;
    payNote: string;
    faqTitle: string;
    faq: { q: string; a: string }[];
  };
  notFound: {
    metaTitle: string;
    eyebrow: string;
    title: Accented;
    lead: string;
    backHome: string;
    readDocs: string;
  };
  error: {
    title: string;
    lead: string;
    retry: string;
    backHome: string;
  };
  docs: {
    metaTitle: string;
    metaDescription: string;
    title: Accented;
    lead: string;
    paths: {
      web: { title: string; body: string; cta: string };
      api: { title: string; body: string; cta: string };
      mcp: { title: string; body: string; cta: string };
    };
    referenceTitle: string;
    reference: {
      auth: { title: string; items: Item[] };
      tools: { title: string; items: Item[] };
      limits: { title: string; items: Item[] };
    };
    sampleTitle: string;
    sampleLead: string;
  };
  status: {
    metaTitle: string;
    metaDescription: string;
    title: Accented;
    lead: string;
    checking: string;
    overallOk: string;
    overallDegraded: string;
    overallDown: string;
    errorTitle: string;
    errorBody: string;
    emptyTitle: string;
    emptyBody: string;
    retry: string;
    /** Carries {time}. */
    checkedAt: string;
    service: string;
    state: string;
    latency: string;
    stateOk: string;
    stateDegraded: string;
    stateDown: string;
    names: { api: string; postgres: string; redis: string; storage: string };
  };
  blog: {
    metaTitle: string;
    metaDescription: string;
    postCount: string;
    postCountOne: string;
    title: Accented;
    lead: string;
    filterLabel: string;
    categories: { all: string; engineering: string; design: string; product: string; changelog: string };
    minRead: string;
    emptyCategory: string;
    /** Shown above a post that has no version in this language. Empty in English. */
    englishNote: string;
    newsletter: {
      title: string;
      lead: string;
      emailLabel: string;
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
      back: string;
      keepReading: string;
      share: string;
      copied: string;
    };
  };
  legal: {
    privacyTitle: string;
    privacyDescription: string;
    termsTitle: string;
    termsDescription: string;
    contents: string;
    /** Carries {date}. */
    effective: string;
  };
  footer: {
    tagline: string;
    productHead: string;
    aboutHead: string;
    api: string;
    status: string;
    privacy: string;
    terms: string;
    productBy: string;
    rights: string;
  };
}

const en: Dictionary = {
  htmlLang: "en",
  ogLocale: "en_US",
  meta: {
    title: "Toolips · Small tools for files, text and the web",
    description:
      "{count} small tools in one place: merge a PDF, resize an image, format JSON, check a domain. Most are free and work without an account.",
  },
  nav: {
    tools: "Tools",
    pricing: "Pricing",
    docs: "Docs",
    blog: "Blog",
    goPro: "Get Pro",
    signIn: "Sign in",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    otherLanguage: "ID",
    otherLanguageAria: "Baca dalam Bahasa Indonesia",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
  },
  hero: {
    proof: "{free} free tools and {pro} on Pro. Most run without an account.",
    title: ["Small tools for ", "everyday", " file, text and web jobs."],
    lead: "Merge a PDF, resize an image, format JSON or check a domain's certificate. {count} tools you can use in the browser, call over REST or hand to an AI agent.",
    searchPlaceholder: "Search {count} tools",
    searchLabel: "Search the tools",
    find: "Find a tool",
  },
  grid: {
    title: ["Every tool, ", "one", " list."],
    lede: "Filter by category or search by name. Free tools have a daily limit; Pro tools need a subscription.",
    resultCount: "{count} tools",
    emptyTitle: "No tool in this category matches.",
    emptyBody: "Try a shorter search, or pick another category.",
    emptyFor: "No tool matches “{query}”.",
    clearSearch: "Clear the search",
  },
  ways: {
    title: ["The same tools, ", "three", " ways in."],
    lede: "Each tool runs on one handler. The web page, the REST API and the MCP server all call it, with the same sign-in and the same quota.",
    web: { title: "In the browser", body: "Open a tool and run it. Most tools need no account.", cta: "Search the tools" },
    api: { title: "Over REST", body: "POST JSON to the handler the web page uses, with your API key.", cta: "Create an API key" },
    mcp: { title: "From an AI agent", body: "Add the MCP server to Claude, Cursor or any agent that speaks MCP.", cta: "Read the MCP setup" },
  },
  upgrade: {
    title: "Need more than {limit} file runs a day?",
    body: "Pro removes the daily caps and adds the AI tools and batch processing.",
    cta: "See Pro for ${price} a month",
  },
  accountDeleted: "Your account was deleted. You are welcome back any time.",
  toolPage: {
    breadcrumbTools: "Tools",
    badgePro: "Pro",
    run: "Run {name}",
    description: "{name} on Toolips: what it does, its limits, and where to run it.",
    limitsTitle: "Limits",
    plan: "Plan",
    planFree: "Free",
    planPro: "Pro subscription",
    runsIn: "Runs in",
    runsBrowser: "Your browser. The file stays on your device.",
    runsServer: "Our server. The file is processed in memory and not kept.",
    fileSize: "File size",
    fileSizeValue: "Up to {mb} MB per file",
    batch: "Files per run",
    batchValue: "Up to {batch} images",
    mergeValue: "Up to {merge} PDFs",
    pages: "Pages",
    pagesValue: "Up to {pages} pages per PDF",
    freeDaily: "Free daily limit",
    freeDailyExports: "{exports} file runs a day",
    proDaily: "With Pro",
    proDailyValue: "No daily cap. Per-minute rate limits still apply.",
    proRequires: "This tool needs a Pro subscription.",
    proCta: "See Pro for ${price} a month",
    comingSoonBadge: "Coming soon",
    comingSoonTitle: "Not available yet",
    comingSoonBody: "This tool is on the way but does not run yet. Every other tool in the list works today.",
    suspendedBadge: "Paused",
    suspendedTitle: "Paused for now",
    suspendedBody: "Downloaders are paused for now. Every other tool in the list works today.",
    related: "More {category} tools",
  },
  pricing: {
    metaTitle: "Pricing · Toolips",
    metaDescription:
      "Free for everyone. Pro adds the AI tools and batch processing and lifts the daily caps, for ${price} a month.",
    title: ["Free to use. ", "Pro", " when you need more."],
    lead: "Every free tool works without a card or an account. Pro adds the AI tools and batch processing and lifts the daily caps.",
    saveAnnual: "Save {pct}% with yearly billing",
    freeHeading: "Free",
    freeTagline: "No card, no sign-up.",
    freeFeatures: ["{free} free tools", "{exports} PDF and image runs a day", "Files up to {mb} MB each"],
    browseTools: "Browse the free tools",
    proHeading: "Pro",
    proTagline: "For daily work, scripts and agents.",
    perMonth: "a month, billed monthly",
    perYear: "a year, billed yearly",
    proFeatures: [
      "Everything in Free",
      "No daily cap on file runs",
      "Batch resize up to {batch} images at once",
      "The AI tools: paraphraser, hooks, captions and more",
      "REST API and MCP with no daily cap",
    ],
    subscribe: "Upgrade to Pro monthly",
    subscribeYearly: "Upgrade to Pro yearly",
    payNote:
      "Checkout runs on Efolusi Pay. Pay with local methods through Mayar, or with crypto through NOWPayments.",
    faqTitle: "Questions about Pro",
    faq: [
      {
        q: "Can I cancel any time?",
        a: "Yes. Cancel from your account. You keep Pro until the paid period ends.",
      },
      {
        q: "Is there a refund policy?",
        a: "Full refund within {days} days, no questions asked. After {days} days we refund the unused time if you cancel. Email hello@toolips.xyz.",
      },
      {
        q: "Are there team plans?",
        a: "Not yet. Shared seats and SSO for teams are planned. Email team@toolips.xyz to hear when they open.",
      },
    ],
  },
  notFound: {
    metaTitle: "Page not found · Toolips",
    eyebrow: "Error {code}",
    title: ["This page ", "isn't", " here."],
    lead: "It may have moved, or it never existed. Every tool is still on the home page.",
    backHome: "Back to the tools",
    readDocs: "Read the docs",
  },
  error: {
    title: "This page failed to load.",
    lead: "Something broke on our side while building this page. Try again, or go back to the tools.",
    retry: "Load the page again",
    backHome: "Back to the tools",
  },
  docs: {
    metaTitle: "Docs · Toolips",
    metaDescription: "Use Toolips from the browser, the REST API, or any AI agent that speaks MCP.",
    title: ["Run Toolips from the ", "browser", ", REST or MCP."],
    lead: "The three paths call the same tool handlers. They share sign-in, quotas and the shape of the output, so a tool behaves the same wherever you call it.",
    paths: {
      web: {
        title: "Browser",
        body: "Open a tool, drop in a file or some text, and run it. Most tools need no account.",
        cta: "Search the tools",
      },
      api: {
        title: "REST API",
        body: "POST /api/tools/{name} with a JSON body and your API key. The response is JSON.",
        cta: "Create an API key",
      },
      mcp: {
        title: "MCP server",
        body: "Add the server at /api/mcp to Claude, Cursor or another MCP client, with the same API key.",
        cta: "Create an API key",
      },
    },
    referenceTitle: "Reference",
    reference: {
      auth: {
        title: "Authentication",
        items: [
          { name: "Cookie session", desc: "The browser signs in with your Efolusi account." },
          { name: "API key", desc: "A tlp_live_… bearer token for the REST API." },
          { name: "MCP token", desc: "The same key, scoped to tools:call." },
        ],
      },
      tools: {
        title: "Tools",
        items: [
          { name: "Catalog", desc: "{count} tools across files, text, code, security and AI." },
          { name: "Input and output", desc: "JSON in, JSON out. File tools return a signed URL." },
          {
            name: "Errors",
            desc: "A JSON body { error } with the matching HTTP status. Status {status} carries upgradeUrl when you are over quota.",
          },
        ],
      },
      limits: {
        title: "Limits",
        items: [
          { name: "Free", desc: "Free tools only. {limit} file runs a day per IP address; text tools are not metered. The count resets each calendar day." },
          { name: "Pro", desc: "No daily cap. Per-minute rate limits still apply." },
          { name: "{xpay}", desc: "Pay per call in USDC, without an account, where an {xpay} verifier is set up." },
        ],
      },
    },
    sampleTitle: "One request",
    sampleLead: "Count the words in a sentence with the word counter.",
  },
  status: {
    metaTitle: "Status · Toolips",
    metaDescription: "Live status of the Toolips API and the services it depends on.",
    title: ["Is Toolips ", "running", "?"],
    lead: "This page asks the Toolips API for its health each time you open it.",
    checking: "Asking the API for its health…",
    overallOk: "Everything is running.",
    overallDegraded: "Some parts are slow or failing.",
    overallDown: "The API is down.",
    errorTitle: "The status check did not answer.",
    errorBody: "Either your connection dropped or the API is down. Check again in a minute.",
    emptyTitle: "The API answered with no checks.",
    emptyBody: "It is up, but it did not report on the database, cache or file storage.",
    retry: "Check again",
    checkedAt: "Checked at {time}",
    service: "Service",
    state: "State",
    latency: "Response time",
    stateOk: "Running",
    stateDegraded: "Degraded",
    stateDown: "Down",
    names: { api: "API server", postgres: "Database", redis: "Cache", storage: "File storage" },
  },
  blog: {
    metaTitle: "Blog · Toolips",
    metaDescription: "Notes from building Toolips: engineering, design, product and the changelog.",
    postCount: "{count} posts",
    postCountOne: "{count} post",
    title: ["Notes from ", "building", " Toolips."],
    lead: "Engineering, design, product decisions and the changelog, written by the team.",
    filterLabel: "Filter posts by category",
    categories: { all: "All", engineering: "Engineering", design: "Design", product: "Product", changelog: "Changelog" },
    minRead: "{min} min read",
    emptyCategory: "No posts in this category yet.",
    englishNote: "",
    newsletter: {
      title: "One email a month.",
      lead: "New posts and changelog highlights. Never more than once a month.",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      subscribe: "Subscribe to the newsletter",
      subscribed: "You're on the list. See you next month.",
      invalid: "Enter a valid email address.",
      ratelimited: "Too many attempts. Try again in a minute.",
      toolarge: "That request was too large. Try again.",
      error: "We couldn't save that sign-up. Try again.",
    },
    post: {
      notFoundTitle: "Post not found · Toolips",
      back: "All posts",
      keepReading: "Keep reading",
      share: "Copy link",
      copied: "Link copied",
    },
  },
  legal: {
    privacyTitle: "Privacy Policy",
    privacyDescription: "How Toolips handles your data.",
    termsTitle: "Terms of Service",
    termsDescription: "The terms you agree to when you use Toolips.",
    contents: "Contents",
    effective: "Effective {date}.",
  },
  footer: {
    tagline: "Small tools for files, text and the web, in one place.",
    productHead: "Toolips",
    aboutHead: "Legal and status",
    api: "API keys",
    status: "Status",
    privacy: "Privacy",
    terms: "Terms",
    productBy: "A product by",
    rights: "All rights reserved.",
  },
};

const id: Dictionary = {
  htmlLang: "id",
  ogLocale: "id_ID",
  meta: {
    title: "Toolips · Alat kecil untuk file, teks, dan web",
    description:
      "{count} alat kecil di satu tempat: gabungkan PDF, ubah ukuran gambar, rapikan JSON, periksa domain. Sebagian besar gratis dan bisa dipakai tanpa akun.",
  },
  nav: {
    tools: "Alat",
    pricing: "Harga",
    docs: "Dokumen",
    blog: "Blog",
    goPro: "Ambil Pro",
    signIn: "Masuk",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    skipToContent: "Lewati ke konten",
    otherLanguage: "EN",
    otherLanguageAria: "Read in English",
    themeToDark: "Ganti ke tema gelap",
    themeToLight: "Ganti ke tema terang",
  },
  hero: {
    proof: "{free} alat gratis dan {pro} di Pro. Sebagian besar jalan tanpa akun.",
    title: ["Alat kecil untuk urusan ", "harian", " file, teks, dan web."],
    lead: "Gabungkan PDF, ubah ukuran gambar, rapikan JSON, atau periksa sertifikat domain. {count} alat yang bisa kamu pakai di browser, panggil lewat REST, atau serahkan ke agen AI.",
    searchPlaceholder: "Cari di {count} alat",
    searchLabel: "Cari alat",
    find: "Temukan alat",
  },
  grid: {
    title: ["Semua alat, ", "satu", " daftar."],
    lede: "Saring per kategori atau cari berdasarkan nama. Alat gratis punya batas harian; alat Pro perlu langganan.",
    resultCount: "{count} alat",
    emptyTitle: "Tidak ada alat yang cocok di kategori ini.",
    emptyBody: "Coba kata kunci yang lebih pendek, atau pilih kategori lain.",
    emptyFor: "Tidak ada alat yang cocok dengan “{query}”.",
    clearSearch: "Hapus pencarian",
  },
  ways: {
    title: ["Alat yang sama, ", "tiga", " jalan masuk."],
    lede: "Tiap alat jalan di satu handler. Halaman web, REST API, dan server MCP memanggilnya dengan akun dan kuota yang sama.",
    web: { title: "Di browser", body: "Buka alat lalu jalankan. Sebagian besar alat tidak perlu akun.", cta: "Cari alat" },
    api: { title: "Lewat REST", body: "Kirim JSON ke handler yang dipakai halaman web, dengan kunci API kamu.", cta: "Buat kunci API" },
    mcp: { title: "Dari agen AI", body: "Tambahkan server MCP ke Claude, Cursor, atau agen lain yang mendukung MCP.", cta: "Baca cara pasang MCP" },
  },
  upgrade: {
    title: "Butuh lebih dari {limit} proses file sehari?",
    body: "Pro menghapus batas harian dan menambah alat AI serta pemrosesan massal.",
    cta: "Lihat Pro, ${price} sebulan",
  },
  accountDeleted: "Akun kamu sudah dihapus. Kamu boleh kembali kapan saja.",
  toolPage: {
    breadcrumbTools: "Alat",
    badgePro: "Pro",
    run: "Jalankan {name}",
    description: "{name} di Toolips: fungsinya, batasnya, dan tempat menjalankannya.",
    limitsTitle: "Batas",
    plan: "Paket",
    planFree: "Gratis",
    planPro: "Langganan Pro",
    runsIn: "Berjalan di",
    runsBrowser: "Browser kamu. File tetap di perangkatmu.",
    runsServer: "Server kami. File diproses di memori dan tidak disimpan.",
    fileSize: "Ukuran file",
    fileSizeValue: "Sampai {mb} MB per file",
    batch: "File per proses",
    batchValue: "Sampai {batch} gambar",
    mergeValue: "Sampai {merge} PDF",
    pages: "Halaman",
    pagesValue: "Sampai {pages} halaman per PDF",
    freeDaily: "Batas harian gratis",
    freeDailyExports: "{exports} proses file sehari",
    proDaily: "Dengan Pro",
    proDailyValue: "Tanpa batas harian. Batas per menit tetap berlaku.",
    proRequires: "Alat ini perlu langganan Pro.",
    proCta: "Lihat Pro, ${price} sebulan",
    comingSoonBadge: "Segera hadir",
    comingSoonTitle: "Belum tersedia",
    comingSoonBody: "Alat ini sedang disiapkan dan belum bisa dijalankan. Semua alat lain di daftar sudah bisa dipakai hari ini.",
    suspendedBadge: "Dijeda",
    suspendedTitle: "Dijeda untuk sementara",
    suspendedBody: "Alat pengunduh sedang dijeda. Semua alat lain di daftar tetap bisa dipakai hari ini.",
    related: "Alat {category} lainnya",
  },
  pricing: {
    metaTitle: "Harga · Toolips",
    metaDescription:
      "Gratis untuk semua. Pro menambah alat AI dan pemrosesan massal serta menghapus batas harian, ${price} sebulan.",
    title: ["Gratis dipakai. ", "Pro", " saat kamu butuh lebih."],
    lead: "Semua alat gratis bisa dipakai tanpa kartu atau akun. Pro menambah alat AI dan pemrosesan massal serta menghapus batas harian.",
    saveAnnual: "Hemat {pct}% dengan tagihan tahunan",
    freeHeading: "Gratis",
    freeTagline: "Tanpa kartu, tanpa daftar.",
    freeFeatures: ["{free} alat gratis", "{exports} proses PDF dan gambar sehari", "File sampai {mb} MB per file"],
    browseTools: "Lihat alat gratis",
    proHeading: "Pro",
    proTagline: "Untuk kerja harian, skrip, dan agen.",
    perMonth: "sebulan, ditagih bulanan",
    perYear: "setahun, ditagih tahunan",
    proFeatures: [
      "Semua yang ada di Gratis",
      "Proses file tanpa batas harian",
      "Ubah ukuran sampai {batch} gambar sekaligus",
      "Alat AI: parafrase, hook, caption, dan lainnya",
      "REST API dan MCP tanpa batas harian",
    ],
    subscribe: "Ambil Pro bulanan",
    subscribeYearly: "Ambil Pro tahunan",
    payNote:
      "Pembayaran lewat Efolusi Pay. Bayar dengan metode lokal lewat Mayar, atau dengan kripto lewat NOWPayments.",
    faqTitle: "Pertanyaan soal Pro",
    faq: [
      {
        q: "Bisa berhenti kapan saja?",
        a: "Bisa. Batalkan dari akun kamu. Pro tetap aktif sampai periode yang sudah dibayar habis.",
      },
      {
        q: "Ada kebijakan refund?",
        a: "Refund penuh dalam {days} hari, tanpa pertanyaan. Lewat {days} hari, sisa waktu yang belum terpakai kami kembalikan kalau kamu berhenti. Email hello@toolips.xyz.",
      },
      {
        q: "Ada paket tim?",
        a: "Belum. Kursi bersama dan SSO untuk tim sedang direncanakan. Email team@toolips.xyz supaya kami kabari saat dibuka.",
      },
    ],
  },
  notFound: {
    metaTitle: "Halaman tidak ditemukan · Toolips",
    eyebrow: "Galat {code}",
    title: ["Halaman ini ", "tidak", " ada."],
    lead: "Mungkin sudah dipindah, atau memang tidak pernah ada. Semua alat masih ada di beranda.",
    backHome: "Kembali ke daftar alat",
    readDocs: "Baca dokumen",
  },
  error: {
    title: "Halaman ini gagal dimuat.",
    lead: "Ada yang rusak di sisi kami saat menyusun halaman ini. Coba lagi, atau kembali ke daftar alat.",
    retry: "Muat ulang halaman",
    backHome: "Kembali ke daftar alat",
  },
  docs: {
    metaTitle: "Dokumen · Toolips",
    metaDescription: "Pakai Toolips dari browser, lewat REST API, atau dari agen AI yang mendukung MCP.",
    title: ["Jalankan Toolips dari ", "browser", ", REST, atau MCP."],
    lead: "Ketiga jalur memanggil handler alat yang sama. Akun, kuota, dan bentuk keluarannya sama, jadi sebuah alat berperilaku sama dari mana pun kamu memanggilnya.",
    paths: {
      web: {
        title: "Browser",
        body: "Buka alat, masukkan file atau teks, lalu jalankan. Sebagian besar alat tidak perlu akun.",
        cta: "Cari alat",
      },
      api: {
        title: "REST API",
        body: "POST /api/tools/{name} dengan body JSON dan kunci API kamu. Responsnya JSON.",
        cta: "Buat kunci API",
      },
      mcp: {
        title: "Server MCP",
        body: "Tambahkan server di /api/mcp ke Claude, Cursor, atau klien MCP lain, dengan kunci API yang sama.",
        cta: "Buat kunci API",
      },
    },
    referenceTitle: "Referensi",
    reference: {
      auth: {
        title: "Autentikasi",
        items: [
          { name: "Sesi cookie", desc: "Browser masuk dengan akun Efolusi kamu." },
          { name: "Kunci API", desc: "Token bearer tlp_live_… untuk REST API." },
          { name: "Token MCP", desc: "Kunci yang sama, dibatasi ke tools:call." },
        ],
      },
      tools: {
        title: "Alat",
        items: [
          { name: "Katalog", desc: "{count} alat untuk file, teks, kode, keamanan, dan AI." },
          { name: "Masukan dan keluaran", desc: "JSON masuk, JSON keluar. Alat file mengembalikan signed URL." },
          {
            name: "Galat",
            desc: "Body JSON { error } dengan status HTTP yang sesuai. Status {status} membawa upgradeUrl saat kuota habis.",
          },
        ],
      },
      limits: {
        title: "Batas",
        items: [
          { name: "Gratis", desc: "Hanya alat gratis. {limit} proses file sehari per alamat IP; alat teks tidak dihitung. Hitungan diulang tiap hari kalender." },
          { name: "Pro", desc: "Tanpa batas harian. Batas per menit tetap berlaku." },
          { name: "{xpay}", desc: "Bayar per panggilan dalam USDC, tanpa akun, bila verifier {xpay} sudah dipasang." },
        ],
      },
    },
    sampleTitle: "Satu permintaan",
    sampleLead: "Hitung kata dalam satu kalimat dengan penghitung kata.",
  },
  status: {
    metaTitle: "Status · Toolips",
    metaDescription: "Status langsung API Toolips dan layanan yang dipakainya.",
    title: ["Apakah Toolips ", "berjalan", "?"],
    lead: "Halaman ini menanyakan kesehatan API Toolips setiap kali kamu membukanya.",
    checking: "Menanyakan kesehatan API…",
    overallOk: "Semua berjalan.",
    overallDegraded: "Sebagian lambat atau gagal.",
    overallDown: "API sedang mati.",
    errorTitle: "Pemeriksaan status tidak menjawab.",
    errorBody: "Koneksimu terputus atau API sedang mati. Periksa lagi semenit lagi.",
    emptyTitle: "API menjawab tanpa hasil pemeriksaan.",
    emptyBody: "API hidup, tapi tidak melaporkan database, cache, atau penyimpanan file.",
    retry: "Periksa lagi",
    checkedAt: "Diperiksa pukul {time}",
    service: "Layanan",
    state: "Keadaan",
    latency: "Waktu respons",
    stateOk: "Berjalan",
    stateDegraded: "Terganggu",
    stateDown: "Mati",
    names: { api: "Server API", postgres: "Database", redis: "Cache", storage: "Penyimpanan file" },
  },
  blog: {
    metaTitle: "Blog · Toolips",
    metaDescription: "Catatan dari membangun Toolips: engineering, desain, produk, dan changelog.",
    postCount: "{count} tulisan",
    postCountOne: "{count} tulisan",
    title: ["Catatan dari ", "membangun", " Toolips."],
    lead: "Engineering, desain, keputusan produk, dan changelog, ditulis oleh tim.",
    filterLabel: "Saring tulisan per kategori",
    categories: { all: "Semua", engineering: "Engineering", design: "Desain", product: "Produk", changelog: "Changelog" },
    minRead: "{min} mnt baca",
    emptyCategory: "Belum ada tulisan di kategori ini.",
    englishNote: "Tulisan ini dalam bahasa Inggris.",
    newsletter: {
      title: "Satu email sebulan.",
      lead: "Tulisan baru dan sorotan changelog. Tidak pernah lebih dari sekali sebulan.",
      emailLabel: "Alamat email",
      emailPlaceholder: "kamu@example.com",
      subscribe: "Langganan buletin",
      subscribed: "Kamu sudah masuk daftar. Sampai jumpa bulan depan.",
      invalid: "Masukkan alamat email yang valid.",
      ratelimited: "Terlalu banyak percobaan. Coba lagi semenit lagi.",
      toolarge: "Permintaan itu terlalu besar. Coba lagi.",
      error: "Pendaftaran belum tersimpan. Coba lagi.",
    },
    post: {
      notFoundTitle: "Tulisan tidak ditemukan · Toolips",
      back: "Semua tulisan",
      keepReading: "Baca juga",
      share: "Salin tautan",
      copied: "Tautan tersalin",
    },
  },
  legal: {
    privacyTitle: "Kebijakan Privasi",
    privacyDescription: "Cara Toolips menangani data kamu.",
    termsTitle: "Ketentuan Layanan",
    termsDescription: "Ketentuan yang kamu setujui saat memakai Toolips.",
    contents: "Isi",
    effective: "Berlaku sejak {date}.",
  },
  footer: {
    tagline: "Alat kecil untuk file, teks, dan web, di satu tempat.",
    productHead: "Toolips",
    aboutHead: "Legal dan status",
    api: "Kunci API",
    status: "Status",
    privacy: "Privasi",
    terms: "Ketentuan",
    productBy: "Produk dari",
    rights: "Hak cipta dilindungi.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, id };

/** The dictionary for a locale, falling back to English for anything unknown. */
export function dictionaryFor(value: string | undefined | null): Dictionary {
  return dictionaries[isLocale(value) ? value : DEFAULT_LOCALE];
}

/**
 * The locale for a render that never passed the middleware. Same order as the
 * middleware's guess for "/": a stored choice wins, then Cloudflare's country,
 * then English.
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
