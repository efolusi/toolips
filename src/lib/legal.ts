// The privacy policy and the terms, in English and Indonesian.
//
// Kept apart from the dictionaries because these are long documents with dates,
// addresses and prices, not interface copy. LegalDocument renders them; inline
// markup is **bold** and [text](href), nothing else.
//
// Every privacy claim is a claim about code. Where each one comes from:
//   upload tools         src/lib/core/file-capabilities.ts (server(...) entries)
//   in memory, not kept  toolips-cloud: server-tools/image-ops.ts, pdf-ops.ts
//   download retention   toolips-cloud: tools-download/src/limits.ts (outputTtlMs)
//   SSO only             toolips-cloud: auth (emailAndPassword disabled)
//   IP keyed hashes      toolips-cloud: usage-log.ts, billing quota.ts, rate-limit.ts
//   90 day usage log     toolips-cloud: db maintenance.ts (USAGE_EVENTS_RETENTION_MS)
//   account deletion     toolips-cloud: auth (user.deleteUser hooks)
// Change this file in the same commit as any of those, in both languages.
//
// The privacy provider list waits on Cloud (not part of this change).

import type { Locale } from "./i18n";
import { localizedPath } from "./locale-routing";
import { PRO_MONTHLY_USD, proPriceTerms, REFUND_WINDOW_DAYS, TOOL_COUNT } from "./site-facts";

export type LegalBlock = string | { ul: string[] };
export type LegalSection = { id: string; head: string; blocks: LegalBlock[] };
export type LegalDoc = { title: string; date: string; intro: LegalBlock[]; sections: LegalSection[] };

// Bump in the same commit as any change to the text; never computed at render.
const PRIVACY_DATE = { en: "October 16, 2026", id: "16 Oktober 2026" };
const TERMS_DATE = { en: "October 16, 2026", id: "16 Oktober 2026" };

const OPERATOR = {
  en: "PT Efolusi Dunia Teknologi, Bumi Cikande Indah, Blok D12 No 15, Cikande, Kab. Serang, Banten 42186, Indonesia",
  id: "PT Efolusi Dunia Teknologi, Bumi Cikande Indah, Blok D12 No 15, Cikande, Kab. Serang, Banten 42186, Indonesia",
};

export function privacyDoc(locale: Locale): LegalDoc {
  if (locale === "id") {
    return {
      title: "Kebijakan Privasi",
      date: PRIVACY_DATE.id,
      intro: [
        "Ringkasnya: banyak alat Toolips jalan sepenuhnya di browser kamu, dan untuk alat itu file atau teksmu tetap di perangkatmu. Alat lain butuh server kami. Halaman ini menjelaskan mana yang mana, apa yang kami simpan, dan berapa lama.",
      ],
      sections: [
        {
          id: "responsible",
          head: "Siapa yang bertanggung jawab",
          blocks: [
            `Toolips dijalankan oleh ${OPERATOR.id}. Kami adalah pengendali data pribadi yang dijelaskan di halaman ini dan memprosesnya sesuai Undang-Undang Pelindungan Data Pribadi (UU No. 27 Tahun 2022). Hubungi kami di [privacy@toolips.xyz](mailto:privacy@toolips.xyz) atau [hi@efolusi.com](mailto:hi@efolusi.com).`,
          ],
        },
        {
          id: "summary",
          head: "Alat mana yang memakai server",
          blocks: [
            "Untuk alat berikut, masukanmu dikirim ke api.toolips.xyz:",
            {
              ul: [
                "**Alat gambar dan PDF.** Gabung, pisah, kompres, putar, dan watermark PDF, JPG ke PDF, serta kompresor, pengubah ukuran, konverter, pemotong, pemutar, watermark, grayscale, ubah ukuran massal, dan alat palet gambar mengunggah file kamu ke server kami. File diproses di memori dan hasilnya langsung dikirim balik. File yang diunggah dan hasilnya tidak disimpan. PDF ke JPG, OCR gambar, dan ucapan ke teks justru jalan di browser kamu.",
                "**Alat AI.** Teks yang kamu masukkan dikirim lewat Efolusi Relay, gateway AI kami, ke model AI yang menjawabnya. Kami tidak menyimpan teks maupun jawabannya.",
                "**Alat keamanan dan jaringan.** Domain, alamat, atau URL yang kamu masukkan dikirim ke server kami, yang mencarinya atau menghubunginya untukmu.",
                "**Pengunduh.** Saat tersedia, server kami mengambil tautan yang kamu tempel dan menyimpan file hasil unduhan di penyimpanan privat paling lama 24 jam agar bisa kamu ambil, lalu menghapusnya.",
              ],
            },
          ],
        },
        {
          id: "collect",
          head: "Yang kami kumpulkan",
          blocks: [
            {
              ul: [
                "**Info akun.** Kamu masuk dengan akun Efolusi di my.efolusi.com. Toolips tidak pernah melihat atau menyimpan kata sandi. Kami menyimpan alamat email dan nama tampilan yang dibagikan akun Efolusi kamu.",
                "**Catatan pemakaian.** Nama alat, waktu, berhasil atau gagal, dan hash SHA-256 dari masukanmu (bukan masukannya). Pemakaian saat masuk terkait dengan akunmu. Untuk pemakaian anonim kami menyimpan hash berkunci dari alamat IP, bukan alamatnya. Catatan pemakaian dihapus setelah 90 hari.",
                "**Kuota gratis dan batas laju.** Kuota harian gratis dan jendela batas laju dihitung per akun, atau untuk pemakaian anonim per hash berkunci dari alamat IP. Alamat aslinya tidak disimpan. Penghitung dihapus setelah hari atau jendelanya lewat.",
                "**Data tagihan.** Efolusi Pay menangani checkout dan pemilihan penyedia pembayaran; Toolips tidak pernah menerima nomor kartu, kunci dompet, atau kredensial penyedia. Kami menyimpan ID transaksi Pay dan status langganan.",
                "**Buletin.** Kalau kamu mendaftar, kami menyimpan alamat emailmu sampai kamu berhenti berlangganan atau meminta kami menghapusnya.",
                "**Cookie.** Cookie sesi SSO Efolusi, cookie `lang` yang mengingat bahasamu, entri `tlp-theme` di penyimpanan browser untuk tema, dan cookie berumur pendek yang menampilkan kunci API baru sekali saja. Tidak ada cookie iklan atau pelacak pihak ketiga.",
              ],
            },
          ],
        },
        {
          id: "not-collected",
          head: "Yang tidak kami kumpulkan",
          blocks: [
            {
              ul: [
                "File yang kamu proses dengan alat gambar dan PDF. File itu tidak disimpan setelah permintaan selesai.",
                "Prompt AI kamu setelah jawabannya dikirim. Kami meneruskannya lewat Efolusi Relay lalu melupakannya.",
                "Alamat IP kamu sebagai penanda yang disimpan. Sesi yang masuk tidak mencatat alamat IP, dan catatan pemakaian anonim hanya memegang hash berkuncinya.",
                "Apa pun untuk iklan. Kami tidak memasang iklan, tidak menjual data, dan tidak punya mitra data.",
              ],
            },
          ],
        },
        {
          id: "processors",
          head: "Sub-pemroses dan layanan lain",
          blocks: [
            "Toolips memakai layanan berikut untuk beroperasi. Cara mereka menangani data diatur oleh kebijakan privasi masing-masing:",
            {
              ul: [
                "**Efolusi Pay**: checkout dan pemilihan penyedia pembayaran. Pemrosesan khusus penyedia terpisah di balik Pay.",
                "**Infrastruktur bersama Efolusi**: server, PostgreSQL, dan penyimpanan objek privat yang dijalankan Efolusi, tempat API dan alat sisi server berjalan.",
                "**Efolusi Relay**: gateway inferensi AI bersama kami, yang meneruskan permintaan alat AI ke penyedia model.",
                "**Cloudflare**: menyajikan toolips.xyz dan api.toolips.xyz sebagai jaringan pengiriman konten dan melindunginya dari serangan, sehingga Cloudflare melihat alamat IP dan permintaanmu, termasuk unggahan. Cloudflare juga memberi tahu negaramu, yang hanya kami pakai untuk memilih bahasa halaman. [cloudflare.com/privacypolicy](https://www.cloudflare.com/privacypolicy/)",
                "**Resend**: email transaksional. [resend.com/privacy](https://resend.com/legal/privacy-policy)",
              ],
            },
            "Beberapa alat juga menghubungi layanan lain atas namamu:",
            {
              ul: [
                "Alat WHOIS dan sertifikat menanyakan server RDAP IANA dan crt.sh dengan domain yang kamu masukkan.",
                "Saat tersedia, pengunduh mengambil dari situs yang kamu tautkan, seperti YouTube atau TikTok, dengan yt-dlp.",
                "Ucapan ke teks jalan di browser kamu. Pada pemakaian pertama, browser mengunduh modelnya dari Hugging Face dan runtime-nya dari CDN jsDelivr.",
              ],
            },
          ],
        },
        {
          id: "rights",
          head: "Hak kamu",
          blocks: [
            {
              ul: [
                "**Akses dan ekspor.** Akun, lalu Danger zone, lalu Export your data. Hasilnya file JSON berisi aktivitas Toolips, referensi tagihan, metadata kunci API, dan job kamu. Identitas dan sesi diekspor dari my.efolusi.com.",
                "**Hapus.** Akun, lalu Danger zone, lalu Delete account. Ini mencabut kunci API, membatalkan dan menghapus job serta file unduhanmu, dan menghapus catatan pemakaian, penghitung kuota, pendaftaran buletin, dan baris tagihan Toolips. Efolusi Pay menyimpan catatannya sendiri atas pembayaran yang kamu lakukan.",
                "**Menolak analitik.** Tidak ada yang perlu ditolak. Kami tidak menjalankan analitik atau skrip pelacak pihak ketiga.",
              ],
            },
          ],
        },
        {
          id: "contact",
          head: "Kontak",
          blocks: [
            "Email [privacy@toolips.xyz](mailto:privacy@toolips.xyz) atau buka issue di GitHub. Kami membalas dalam 5 hari kerja.",
          ],
        },
        {
          id: "changes",
          head: "Perubahan",
          blocks: [
            "Perubahan kami umumkan di sini. Perubahan penting dikirim lewat email ke semua pemilik akun 30 hari sebelum berlaku.",
          ],
        },
      ],
    };
  }
  return {
    title: "Privacy Policy",
    date: PRIVACY_DATE.en,
    intro: [
      "The short version: many Toolips tools run entirely in your browser, and for those your file or text stays on your device. Other tools need our server. This page says which is which, what we keep, and for how long.",
    ],
    sections: [
      {
        id: "responsible",
        head: "Who is responsible",
        blocks: [
          `Toolips is operated by ${OPERATOR.en}. We are the controller of the personal data described on this page and process it in line with Indonesia's Personal Data Protection Law (Law No. 27 of 2022). Reach us at [privacy@toolips.xyz](mailto:privacy@toolips.xyz) or [hi@efolusi.com](mailto:hi@efolusi.com).`,
        ],
      },
      {
        id: "summary",
        head: "Which tools use our server",
        blocks: [
          "For these tools, your input is sent to api.toolips.xyz:",
          {
            ul: [
              "**Image and PDF tools.** Merge, split, compress, rotate and watermark PDF, JPG to PDF, and the image compressor, resizer, converter, cropper, rotator, watermark, grayscale, batch resize and palette tools upload your file to our server. It is processed in memory and the result is sent straight back. The uploaded file and the result are not saved. PDF to JPG, image OCR and speech to text run in your browser instead.",
              "**AI tools.** The text you enter is sent through Efolusi Relay, our AI gateway, to the AI model that answers it. We do not store the text or the answer.",
              "**Security and network tools.** The domain, address or URL you enter is sent to our server, which looks it up or connects to it for you.",
              "**Downloaders.** When they are available, our server fetches the link you paste and keeps the downloaded file in private storage for up to 24 hours so you can collect it, then deletes it.",
            ],
          },
        ],
      },
      {
        id: "collect",
        head: "What we collect",
        blocks: [
          {
            ul: [
              "**Account info.** You sign in with your Efolusi account at my.efolusi.com. Toolips never sees or stores a password. We keep the email address and display name your Efolusi account shares with us.",
              "**Usage events.** Tool name, timestamp, success or failure, and a SHA-256 hash of your input (not the input itself). Signed-in usage is tied to your account. For anonymous use we keep a keyed hash of your IP address instead of the address. Usage events are deleted after 90 days.",
              "**Free quota and rate limits.** Daily free quotas and short rate limit windows are counted per account, or for anonymous use per keyed hash of your IP address. The raw address is not stored. Counters are removed once their day or window has passed.",
              "**Billing data.** Efolusi Pay handles checkout and payment provider routing; Toolips never receives card numbers, wallet keys or provider credentials. We store Pay transaction IDs and subscription status.",
              "**Newsletter sign-ups.** If you opt in, we store your email address until you unsubscribe or ask us to delete it.",
              "**Cookies.** The Efolusi SSO session cookie, a `lang` cookie that remembers your language, a `tlp-theme` entry in browser storage for the theme, and a short-lived cookie that shows a new API key to you once. No advertising or third-party tracking cookies.",
            ],
          },
        ],
      },
      {
        id: "not-collected",
        head: "What we don't collect",
        blocks: [
          {
            ul: [
              "The files you process with the image and PDF tools. They are not kept after the request.",
              "Your AI prompts after the response is returned. We pass them through Efolusi Relay and forget them.",
              "Your IP address as a stored identifier. Signed-in sessions do not record IP addresses, and anonymous usage and quota records hold only a keyed hash of it.",
              "Anything for advertising. We don't run ads, we don't sell data, and we have no data partner.",
            ],
          },
        ],
      },
      {
        id: "processors",
        head: "Sub-processors and other services",
        blocks: [
          "Toolips uses these services to operate. Their handling is governed by their own privacy policies:",
          {
            ul: [
              "**Efolusi Pay**: checkout and payment routing. Provider-specific processing is isolated behind Pay.",
              "**Efolusi shared infrastructure**: the server, PostgreSQL and private object storage operated by Efolusi, where the API and the server-side tools run.",
              "**Efolusi Relay**: our shared AI inference gateway, which passes AI tool requests to the model provider.",
              "**Cloudflare**: serves toolips.xyz and api.toolips.xyz as our content delivery network and protects them from attacks, so it sees your IP address and the requests you make, including uploads. It also tells us your country, which we use only to pick the page language. [cloudflare.com/privacypolicy](https://www.cloudflare.com/privacypolicy/)",
              "**Resend**: transactional email. [resend.com/privacy](https://resend.com/legal/privacy-policy)",
            ],
          },
          "Some tools also contact other services on your behalf:",
          {
            ul: [
              "The WHOIS and certificate tools query IANA RDAP servers and crt.sh with the domain you enter.",
              "When they are available, downloaders fetch from the site you link, such as YouTube or TikTok, using yt-dlp.",
              "Speech to text runs in your browser. On first use your browser downloads the model from Hugging Face and the runtime from the jsDelivr CDN.",
            ],
          },
        ],
      },
      {
        id: "rights",
        head: "Your rights",
        blocks: [
          {
            ul: [
              "**Access and export.** Account, then Danger zone, then Export your data. Returns a JSON file of your Toolips activity, billing references, API key metadata and jobs. Your identity and sessions are exported from my.efolusi.com.",
              "**Delete.** Account, then Danger zone, then Delete account. This revokes your API keys, cancels and deletes your download jobs and files, and deletes your usage events, quota counters, newsletter sign-up and Toolips billing rows. Efolusi Pay keeps its own record of payments you made.",
              "**Opt out of analytics.** There is nothing to opt out of. We don't run analytics or third-party tracking scripts.",
            ],
          },
        ],
      },
      {
        id: "contact",
        head: "Contact",
        blocks: [
          "Email [privacy@toolips.xyz](mailto:privacy@toolips.xyz) or open an issue on GitHub. We reply within 5 business days.",
        ],
      },
      {
        id: "changes",
        head: "Changes",
        blocks: [
          "We post changes here. Material changes get an email to all account holders 30 days before they take effect.",
        ],
      },
    ],
  };
}

export function termsDoc(locale: Locale, annualEnabled: boolean): LegalDoc {
  const status = localizedPath(locale, "/status");
  if (locale === "id") {
    return {
      title: "Ketentuan Layanan",
      date: TERMS_DATE.id,
      intro: [
        `Ketentuan ini berlaku saat kamu memakai Toolips, situs dengan ${TOOL_COUNT} alat utilitas. Ketentuan ini diatur oleh hukum Republik Indonesia.`,
      ],
      sections: [
        {
          id: "what",
          head: "Apa ini",
          blocks: [
            `Toolips adalah situs dengan ${TOOL_COUNT} alat utilitas. Tingkat gratis bisa dipakai tanpa akun; tingkat Pro menghapus batas harian dan menambah alat AI, pemrosesan massal, dan akses API tanpa batas harian.`,
          ],
        },
        {
          id: "account",
          head: "Akun kamu",
          blocks: [
            "Kamu masuk dengan akun Efolusi, dan kamu bertanggung jawab atas semua yang terjadi di dalamnya. Jangan bagikan akses. Kalau curiga akunmu dibobol, keluar dari semua perangkat lewat Akun, lalu Sessions.",
          ],
        },
        {
          id: "use",
          head: "Pemakaian yang diperbolehkan",
          blocks: [
            "Jangan pakai Toolips untuk:",
            {
              ul: [
                "Melanggar hukum di yurisdiksimu atau yurisdiksi kami.",
                "Melanggar hak cipta orang lain. Jangan proses konten yang bukan hakmu.",
                "Memindai keamanan sistem yang bukan milikmu atau tanpa izin untuk mengujinya.",
                "Spam, pelecehan, atau penipuan lewat konten buatan AI.",
                "Membanjiri infrastruktur kami. Batas laju ada untuk dihormati.",
              ],
            },
            "Kami berhak menangguhkan akun yang menyalahgunakan layanan. Kami akan menjelaskan alasannya dan mengembalikan sisa waktu berbayar bila itu terjadi.",
          ],
        },
        {
          id: "pricing",
          head: "Harga",
          blocks: [
            `${proPriceTerms(annualEnabled, "id")} Pembayaran memakai checkout Efolusi Pay. Pemilihan penyedia pembayaran ditangani Pay, dan Toolips tidak pernah menerima kredensial penyedia. Pro tetap aktif sampai periode berbayar habis.`,
            `Kami tidak menaikkan harga untuk pelanggan yang sudah ada. Kalau hari ini kamu membayar $${PRO_MONTHLY_USD} sebulan, kamu tetap membayar $${PRO_MONTHLY_USD}.`,
          ],
        },
        {
          id: "refunds",
          head: "Refund",
          blocks: [
            `Refund penuh dalam ${REFUND_WINDOW_DAYS} hari, tanpa pertanyaan. Lewat ${REFUND_WINDOW_DAYS} hari, sisa waktu yang belum terpakai kami kembalikan bila kamu berhenti dengan alasan yang wajar. Email [hello@toolips.xyz](mailto:hello@toolips.xyz).`,
          ],
        },
        {
          id: "availability",
          head: "Ketersediaan layanan",
          blocks: [
            `Kami menargetkan uptime bulanan 99,5%. Saat ini kami belum menawarkan kredit SLA. Kalau itu penting bagimu, tunggu sampai kami menawarkannya. Status layanan: [toolips.xyz/status](${status}).`,
          ],
        },
        {
          id: "your-content",
          head: "Konten kamu",
          blocks: [
            "Yang kamu masukkan tetap milikmu. Kami tidak mengklaim hak atas file, prompt, atau hasilmu. Alat sisi server boleh menyimpan hasil job sementara di penyimpanan privat agar bisa kamu unduh, dan menghapus akun akan menghapus data job yang terkait dengan akun.",
          ],
        },
        {
          id: "our-content",
          head: "Konten kami",
          blocks: [
            "Kode, sistem desain, dan tulisan blog Toolips adalah © Toolips. Bagian berlisensi MIT (handler alat open-source di `@toolips/tools-utility`) berlisensi MIT. Silakan pakai di proyekmu sendiri; atribusi kami hargai.",
          ],
        },
        {
          id: "warranties",
          head: "Jaminan",
          blocks: [
            "Toolips disediakan apa adanya. Kami tidak menjamin setiap alat bekerja untuk setiap file, hasil AI selalu benar, atau layanan tidak pernah mati. Periksa sendiri hasil yang penting.",
          ],
        },
        {
          id: "liability",
          head: "Tanggung jawab",
          blocks: [
            "Sejauh diizinkan hukum, total tanggung jawab kami kepadamu atas klaim apa pun yang timbul dari Toolips dibatasi sebesar jumlah yang kamu bayarkan kepada kami dalam 12 bulan terakhir (nol untuk pengguna gratis).",
          ],
        },
        {
          id: "termination",
          head: "Pengakhiran",
          blocks: [
            "Kamu bisa menghapus akun kapan saja. Kami bisa mengakhiri akun yang melanggar aturan pemakaian atau akun gratis yang tidak aktif 24 bulan atau lebih (kami kirim email dulu).",
          ],
        },
        {
          id: "law",
          head: "Hukum yang berlaku",
          blocks: [
            "Ketentuan ini diatur oleh hukum Republik Indonesia, sama seperti [Ketentuan Platform Efolusi](https://efolusi.com/id/terms).",
            "Kalau kamu punya keluhan atau sengketa, tulis dulu ke [hello@toolips.xyz](mailto:hello@toolips.xyz). Kami akan berusaha menyelesaikannya bersamamu dalam 30 hari.",
            "Ketentuan ini tidak menghapus hakmu sebagai konsumen untuk memakai jalur penyelesaian sengketa yang diberikan hukum Indonesia, seperti Badan Penyelesaian Sengketa Konsumen (BPSK).",
          ],
        },
        {
          id: "changes",
          head: "Perubahan",
          blocks: [
            "Kami bisa memperbarui ketentuan ini. Perubahan penting dikirim lewat email dengan pemberitahuan 30 hari. Perubahan kecil (salah ketik, info kontak) langsung kami terapkan.",
          ],
        },
        {
          id: "contact",
          head: "Kontak",
          blocks: [
            `Toolips dijalankan oleh ${OPERATOR.id}.`,
            "Email [hello@toolips.xyz](mailto:hello@toolips.xyz). Kami membalas dalam 5 hari kerja.",
          ],
        },
      ],
    };
  }
  return {
    title: "Terms of Service",
    date: TERMS_DATE.en,
    intro: [
      `These terms apply when you use Toolips, a website with ${TOOL_COUNT} utility tools. They are governed by the laws of the Republic of Indonesia.`,
    ],
    sections: [
      {
        id: "what",
        head: "What this is",
        blocks: [
          `Toolips is a website with ${TOOL_COUNT} utility tools. You can use the free tier without an account; the Pro tier removes the daily limits and adds AI tools, batch processing, and API access with no daily cap.`,
        ],
      },
      {
        id: "account",
        head: "Your account",
        blocks: [
          "You sign in with your Efolusi account, and you're responsible for everything that happens under it. Don't share access. If you suspect compromise, sign out everywhere from Account, then Sessions.",
        ],
      },
      {
        id: "use",
        head: "Acceptable use",
        blocks: [
          "Don't use Toolips to:",
          {
            ul: [
              "Break a law in your jurisdiction or ours.",
              "Infringe someone else's copyright. Don't process content you don't have rights to.",
              "Run security scans against systems you don't own or have permission to test.",
              "Spam, harass, or defraud people with AI-generated content.",
              "Try to overwhelm our infrastructure. The rate limits are there; respect them.",
            ],
          },
          "We reserve the right to suspend accounts that abuse the service. We'll explain why, and refund unused paid time if we do.",
        ],
      },
      {
        id: "pricing",
        head: "Pricing",
        blocks: [
          `${proPriceTerms(annualEnabled, "en")} Payments use Efolusi Pay checkout. Provider routing is handled by Pay and Toolips never receives provider credentials. You keep Pro until the paid period ends.`,
          `We won't raise prices on existing subscribers. If you're paying $${PRO_MONTHLY_USD} a month today, you'll keep paying $${PRO_MONTHLY_USD}.`,
        ],
      },
      {
        id: "refunds",
        head: "Refunds",
        blocks: [
          `Full refund within ${REFUND_WINDOW_DAYS} days, no questions. After ${REFUND_WINDOW_DAYS} days we'll refund the unused time if you cancel for a real reason. Email [hello@toolips.xyz](mailto:hello@toolips.xyz).`,
        ],
      },
      {
        id: "availability",
        head: "Service availability",
        blocks: [
          `We aim for 99.5% monthly uptime. We don't currently offer SLA credits. If that matters to you, hold off until we do. Status: [toolips.xyz/status](${status}).`,
        ],
      },
      {
        id: "your-content",
        head: "Your content",
        blocks: [
          "You own what you put in. We claim no rights over your files, prompts, or outputs. Server-side tools may temporarily store job outputs in private storage so you can download them, and deleting your account removes account-tied job data.",
        ],
      },
      {
        id: "our-content",
        head: "Our content",
        blocks: [
          "The Toolips code, design system, and blog posts are © Toolips. The MIT-licensed parts (the open-source tool handlers in `@toolips/tools-utility`) are MIT-licensed. Use them in your own projects; attribution appreciated.",
        ],
      },
      {
        id: "warranties",
        head: "Warranties",
        blocks: [
          "We provide Toolips as is. We don't warrant that every tool will work for every file, that AI outputs will be correct, or that the service will never go down. Verify important outputs yourself.",
        ],
      },
      {
        id: "liability",
        head: "Liability",
        blocks: [
          "To the extent allowed by law, our total liability to you for any claim arising from Toolips is capped at the amount you've paid us in the past 12 months (zero for free users).",
        ],
      },
      {
        id: "termination",
        head: "Termination",
        blocks: [
          "You can delete your account any time. We can terminate accounts that violate the acceptable-use policy or that have been inactive for 24 months or more on the free tier (we'll email first).",
        ],
      },
      {
        id: "law",
        head: "Governing law",
        blocks: [
          "These terms are governed by the laws of the Republic of Indonesia, the same as the [Efolusi Platform Terms](https://efolusi.com/en/terms).",
          "If you have a complaint or a dispute, write to [hello@toolips.xyz](mailto:hello@toolips.xyz) first. We will try to resolve it with you within 30 days.",
          "Nothing here takes away your right as a consumer to use the dispute channels that Indonesian law gives you, such as the Consumer Dispute Settlement Body (BPSK).",
        ],
      },
      {
        id: "changes",
        head: "Changes",
        blocks: [
          "We can update these terms. Material changes get an email and 30 days' notice. Trivial changes (typos, contact info) we just publish.",
        ],
      },
      {
        id: "contact",
        head: "Contact",
        blocks: [
          `Toolips is operated by ${OPERATOR.en}.`,
          "Email [hello@toolips.xyz](mailto:hello@toolips.xyz). We reply within 5 business days.",
        ],
      },
    ],
  };
}
