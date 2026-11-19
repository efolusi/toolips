// Indonesian copy for the tool CATALOG — names, descriptions, category labels.
//
// This lives in a separate dictionary rather than in ~/lib/core/catalog
// on purpose: the catalog is the single source of truth for which tools EXIST
// (scripts/check-catalog.mjs parses its literal shape), while this file is pure
// presentation. A missing entry here can only ever fall back to the English
// catalog copy; it can never make a tool appear or disappear.
//
// `name` is optional: tool names that Indonesian readers use in English anyway
// (Lorem Ipsum, JSON Formatter, WHOIS Lookup, the downloaders…) are omitted and
// fall back to the catalog name. `desc` is always present — descriptions are
// sentences, and sentences get translated.

import type { Tool } from "~/lib/tools";
import { DEFAULT_LOCALE, type Locale } from "~/lib/i18n";

export const TOOL_COPY_ID: Record<string, { name?: string; desc?: string }> = {
  // PDF
  "merge-pdf": { name: "Gabungkan PDF", desc: "Satukan beberapa PDF menjadi satu dokumen utuh." },
  "split-pdf": { name: "Pisahkan PDF", desc: "Pisahkan halaman atau kumpulan halaman agar mudah dikonversi." },
  "jpg-to-pdf": { name: "JPG ke PDF", desc: "Ubah gambar menjadi satu dokumen PDF dalam hitungan detik." },
  "pdf-to-jpg": { name: "PDF ke JPG", desc: "Ekstrak gambar atau simpan tiap halaman PDF sebagai JPG." },
  "compress-pdf": { name: "Kompres PDF", desc: "Kecilkan ukuran dokumen PDF kamu seketika." },
  "rotate-pdf": { name: "Putar PDF", desc: "Putar PDF sesuai arah yang kamu butuhkan." },
  "watermark-pdf": { desc: "Bubuhkan watermark teks di seluruh halaman PDF kamu." },

  // Image
  "image-compressor": { name: "Kompresor Gambar", desc: "Kompres gambar JPG, PNG, atau GIF dengan mudah." },
  "resize-image": { name: "Ubah Ukuran Gambar", desc: "Tentukan dimensi dalam piksel atau persentase." },
  "image-converter": { name: "Konverter Gambar", desc: "Konversi gambar ke JPG, PNG, WebP, atau AVIF." },
  "crop-image": { name: "Potong Gambar", desc: "Potong gambar dengan rasio aspek interaktif." },
  "rotate-image": { name: "Putar Gambar", desc: "Putar gambar dengan mudah ke sudut berapa pun." },
  "watermark-image": { name: "Watermark Gambar", desc: "Bubuhkan teks di atas gambar kamu dalam hitungan detik." },
  "image-ocr": { name: "Gambar ke Teks (OCR)", desc: "Ekstrak teks dari gambar dengan OCR berkualitas tinggi." },
  "batch-resize": { name: "Ubah Ukuran Massal", desc: "Ubah ukuran banyak gambar sekaligus, unduh sebagai ZIP." },
  "grayscale-image": { name: "Gambar Grayscale", desc: "Ubah gambar berwarna menjadi hitam-putih." },

  // Color
  "palette-gen": { name: "Generator Palet Warna", desc: "Buat palet yang serasi dari warna dasar mana pun." },
  "palette-extract": { name: "Ekstraktor Palet Warna", desc: "Ekstrak warna dominan dari gambar sebagai HEX + RGB." },
  "color-converter": { name: "Konverter Warna", desc: "Konversi warna antara HEX, RGB, dan HSL." },

  // Text
  "word-counter": { name: "Penghitung Kata", desc: "Hitung kata, karakter, dan kalimat secara real-time." },
  "character-counter": { name: "Penghitung Karakter", desc: "Hitung dan analisis karakter dalam teks kamu." },
  "case-converter": { name: "Konverter Kapitalisasi", desc: "UPPER, lower, Title, Sentence: ubah kapitalisasi apa pun." },
  "text-cleaner": { name: "Pembersih Teks", desc: "Hapus spasi berlebih, baris kosong, dan karakter sampah." },
  "remove-duplicates": { name: "Hapus Baris Duplikat", desc: "Rapikan daftar kamu dengan membuang duplikat." },
  "line-counter": { name: "Penghitung Baris", desc: "Hitung jumlah baris dalam teks kamu." },
  "slug-gen": { name: "Generator Slug", desc: "Buat slug URL ramah SEO dari teks." },
  "lorem-ipsum": { desc: "Buat teks pengisi untuk rancangan desain kamu." },
  "paraphraser": { name: "Parafrase", desc: "Penulisan ulang bertenaga AI dalam berbagai gaya bahasa." },
  "grammar-checker": { name: "Pemeriksa Tata Bahasa", desc: "Periksa ejaan dan tata bahasa dengan saran instan." },

  // Developer
  "markdown-to-html": { name: "Markdown ke HTML", desc: "Pratinjau dan konversi Markdown menjadi HTML mentah." },
  "html-formatter": { desc: "Rapikan dan atur indentasi kode HTML kamu dengan benar." },
  "css-minifier": { desc: "Kompres CSS untuk mempercepat performa situs." },
  "diff-checker": { desc: "Bandingkan dua teks dan soroti apa yang berubah." },
  "word-diff": { desc: "Bandingkan teks kata per kata, dengan sorotan inline." },
  "regex-tester": { desc: "Tulis dan uji regex dengan sorotan kecocokan langsung." },
  "js-beautifier": { desc: "Rapikan JS yang berantakan agar mudah dibaca, atau minify." },
  "svg-optimizer": { desc: "Buang metadata dan spasi kosong dari file SVG." },
  "code-screenshot": { name: "Screenshot Kode", desc: "Gambar potongan kode yang cantik untuk media sosial." },
  "json-formatter": { desc: "Rapikan atau minify data JSON kamu." },
  "json-to-csv": { name: "JSON ke CSV", desc: "Ubah array JSON menjadi spreadsheet CSV." },
  "csv-json": { desc: "Konversi CSV ke JSON atau JSON ke CSV seketika." },

  // Generator
  "qr-gen": { name: "Generator Kode QR", desc: "Buat kode QR kustom untuk URL dan teks." },
  "password-gen": { name: "Generator Password", desc: "Buat password acak yang aman seketika." },
  "uuid-gen": { name: "Generator UUID", desc: "Hasilkan pengenal unik universal." },
  "base64": { name: "Encode/Decode Base64", desc: "Encode atau decode data ke/dari Base64 dengan mudah." },
  "url-encoder": { name: "Encoder/Decoder URL", desc: "Encode atau decode URL agar aman dikirimkan." },
  "timestamp": { name: "Konverter Timestamp", desc: "Ubah timestamp Unix menjadi tanggal, dan sebaliknya." },

  // Calculator
  "unit-converter": { name: "Konverter Satuan", desc: "Konversi panjang, berat, volume, dan banyak lagi." },
  "percentage-calc": { name: "Kalkulator Persentase", desc: "Hitung persentase, kenaikan, dan penurunan." },
  "age-calc": { name: "Kalkulator Umur", desc: "Hitung umur persis berdasarkan tanggal lahir." },
  "currency-format": { name: "Pemformat Mata Uang", desc: "Format angka menjadi tulisan mata uang sesuai lokal." },
  "aspect-ratio": { name: "Kalkulator Rasio Aspek", desc: "Hitung lebar, tinggi, atau rasio yang disederhanakan." },

  // Content
  "caption-gen": { name: "Generator Caption", desc: "Buat caption yang menarik untuk media sosial." },
  "hashtag-gen": { name: "Generator Hashtag", desc: "Temukan hashtag terbaik untuk konten kamu." },
  "bio-gen": { name: "Generator Bio", desc: "Buat bio sosial yang profesional atau kreatif." },
  "content-idea-gen": { name: "Generator Ide Konten", desc: "Hasilkan ide blog, video, dan post dengan cepat." },
  "hook-gen": { name: "Generator Hook", desc: "Tulis kalimat pembuka yang memikat untuk video dan artikel." },
  "yt-title-gen": { name: "Generator Judul YouTube", desc: "Hasilkan ide judul video dengan CTR tinggi." },
  "yt-desc-gen": { name: "Deskripsi YouTube", desc: "Hasilkan deskripsi YouTube yang terstruktur." },
  "thumbnail-text": { name: "Teks Thumbnail", desc: "Buat frasa pendek yang nendang untuk thumbnail." },
  "tts": { name: "Teks ke Suara", desc: "Ubah teks menjadi suara yang terdengar alami." },
  "stt": { name: "Suara ke Teks", desc: "Transkripsikan audio suara menjadi teks." },

  // Download
  "yt-dl": { desc: "Unduh video YouTube atau audionya saja." },
  "tiktok-dl": { desc: "Unduh video TikTok sebagai MP4 atau MP3." },
  "ig-dl": { desc: "Unduh reels dan post Instagram yang publik." },
  "twitter-dl": { desc: "Unduh video dan GIF dari post X." },
  "fb-dl": { desc: "Unduh video publik Facebook dalam kualitas HD." },
  "video-mp3": { name: "Video ke MP3", desc: "Ambil audio dari tautan video yang didukung sebagai MP3." },
  "audio-trim": { name: "Pemotong Audio", desc: "Atur titik awal + akhir, unduh MP3 hasil potongannya." },
  "video-transcribe": { name: "Transkriber Video", desc: "Transkripsikan ucapan berbahasa Inggris dari tautan video, langsung di browser." },
  "playlist-dl": { desc: "Telusuri dan unduh video playlist satu per satu." },
  "subtitle-dl": { desc: "Unduh subtitle SRT dari video YouTube." },
  "video-thumb": { name: "Ekstraktor Thumbnail", desc: "Simpan thumbnail resolusi penuh dari tautan video yang didukung." },

  // Security
  "security-headers": { desc: "Periksa header keamanan HTTP: CSP, HSTS, X-Frame." },
  "ssl-checker": { desc: "Masa berlaku sertifikat, versi TLS, dan kekuatan cipher." },
  "http-inspector": { desc: "Kirim permintaan HTTP kustom, periksa respons mentahnya." },
  "secret-scanner": { desc: "Deteksi kunci, token, dan password yang bocor di kode." },
  "password-strength": { name: "Kekuatan Password", desc: "Cek kekuatan + kebocoran, semuanya lokal." },
  "port-scanner": { desc: "Periksa port terbuka yang umum (SSH, HTTP, database)." },
  "dns-lookup": { desc: "Record A, AAAA, MX, TXT, CNAME, NS, SOA." },
  "whois": { desc: "Registrar, tanggal pembuatan, dan kedaluwarsa domain apa pun." },
  "subdomain-finder": { name: "Pencari Subdomain", desc: "Temukan subdomain aktif lewat probing DNS." },
  "cert-transparency": { desc: "Semua sertifikat SSL yang pernah diterbitkan untuk sebuah domain." },
};

/** Indonesian labels for the category chips, keyed by the catalog's English names. */
export const CATEGORY_COPY_ID: Record<string, string> = {
  All: "Semua",
  PDF: "PDF",
  Image: "Gambar",
  Color: "Warna",
  Text: "Teks",
  Developer: "Developer",
  Generator: "Generator",
  Calculator: "Kalkulator",
  Content: "Konten",
  Download: "Unduhan",
  Security: "Keamanan",
};

/** The name and description to render for a tool, in the reader's language. */
export function toolCopy(tool: Tool, locale: Locale): { name: string; desc: string } {
  if (locale === DEFAULT_LOCALE) return { name: tool.name, desc: tool.desc };
  const copy = TOOL_COPY_ID[tool.id];
  return { name: copy?.name ?? tool.name, desc: copy?.desc ?? tool.desc };
}

/** The display label for a category chip, in the reader's language. */
export function categoryLabel(category: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return category;
  return CATEGORY_COPY_ID[category] ?? category;
}
