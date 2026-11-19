import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { FILE_TOOL_CAPABILITIES } from "~/lib/core/file-capabilities";
import { describe, expect, it } from "vitest";

// The privacy policy (src/lib/legal.ts) used to say files never touch the server, while every
// server-multipart tool uploads to api.toolips.xyz. These checks tie the page
// to the capability table so a new upload tool cannot ship unmentioned.
const page = readFileSync(fileURLToPath(new URL("../lib/legal.ts", import.meta.url)), "utf8")
  .replace(/\s+/g, " ");

// How each tool is named in the "Image and PDF tools" paragraph.
const UPLOAD_TOOL_PHRASES: Record<string, string> = {
  "merge-pdf": "Merge, split, compress, rotate and watermark PDF",
  "split-pdf": "Merge, split, compress, rotate and watermark PDF",
  "compress-pdf": "Merge, split, compress, rotate and watermark PDF",
  "rotate-pdf": "Merge, split, compress, rotate and watermark PDF",
  "watermark-pdf": "Merge, split, compress, rotate and watermark PDF",
  "jpg-to-pdf": "JPG to PDF",
  "image-compressor": "image compressor",
  "resize-image": "resizer",
  "image-converter": "converter",
  "crop-image": "cropper",
  "rotate-image": "rotator",
  "watermark-image": "watermark",
  "grayscale-image": "grayscale",
  "batch-resize": "batch resize",
  "palette-extract": "palette tools",
};

describe("privacy page", () => {
  it("names every tool that uploads files to the server", () => {
    const uploading = Object.values(FILE_TOOL_CAPABILITIES)
      .filter((c) => c.runtime === "server-multipart")
      .map((c) => c.id)
      .sort();
    expect(Object.keys(UPLOAD_TOOL_PHRASES).sort()).toEqual(uploading);
    for (const phrase of new Set(Object.values(UPLOAD_TOOL_PHRASES))) {
      expect(page).toContain(phrase);
    }
    expect(page).toContain("upload your file to our server");
  });

  it("drops the claims the code contradicts", () => {
    expect(page).not.toMatch(/never touches our server/i);
    expect(page).not.toMatch(/hashed password/i);
  });

  it("says sign-in is Efolusi SSO with no Toolips password", () => {
    expect(page).toContain("my.efolusi.com");
    expect(page).toMatch(/never sees or stores a password/);
  });
});
