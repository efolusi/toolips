/**
 * Canonical execution contract for every catalog entry whose surface is
 * `file`. The web dispatcher and the server processors consume this object;
 * it is not a second marketing catalog.
 */

export const FILE_PROCESSING_LIMITS = Object.freeze({
  maxFileBytes: 50 * 1024 * 1024,
  imageRequestBytes: 60 * 1024 * 1024,
  pdfRequestBytes: 120 * 1024 * 1024,
  maxBatchImages: 50,
  maxMergePdfs: 25,
  maxPdfPages: 500,
  maxSplitOutputPages: 500,
  maxImageDimension: 8_000,
  maxDecodedImagePixels: 24_000_000,
  maxWatermarkTextCharacters: 120,
  imageProcessorTimeoutSeconds: 20,
  /** Wall-clock budget for one PDF request's pdf-lib work. */
  pdfProcessorTimeoutSeconds: 30,
  /** Wall-clock budget for a whole batch resize, every image included. */
  batchResizeTimeoutSeconds: 60,
  maxBrowserPdfRasterPages: 50,
} as const);

export type FileToolRuntime = "server-multipart" | "browser-local";
export type ServerFileFamily = "image" | "pdf";

export type FileToolCapability = {
  id: string;
  runtime: FileToolRuntime;
  accept: string;
  multiple: boolean;
  output: "binary" | "json" | "browser-artifact" | "text";
  availability: {
    status: "registered" | "unavailable";
    requirements: readonly string[];
    failureMode: "fail-closed";
    reason?: string;
  };
  server?: {
    family: ServerFileFamily;
    operation: string;
  };
};

function server(
  id: string,
  family: ServerFileFamily,
  operation: string,
  options: Partial<Pick<FileToolCapability, "accept" | "multiple" | "output">> = {},
): FileToolCapability {
  return {
    id,
    runtime: "server-multipart",
    accept: options.accept ?? (family === "pdf" ? "application/pdf" : "image/*"),
    multiple: options.multiple ?? false,
    output: options.output ?? "binary",
    availability: {
      status: "registered",
      requirements: family === "image" ? ["sharp"] : ["pdf-lib"],
      failureMode: "fail-closed",
    },
    server: { family, operation },
  };
}

function browser(
  id: string,
  accept: string,
  output: FileToolCapability["output"],
  requirements: readonly string[],
): FileToolCapability {
  return {
    id,
    runtime: "browser-local",
    accept,
    multiple: false,
    output,
    availability: {
      status: "registered",
      requirements,
      failureMode: "fail-closed",
    },
  };
}

export const FILE_TOOL_CAPABILITIES: Readonly<Record<string, FileToolCapability>> = Object.freeze({
  "merge-pdf": server("merge-pdf", "pdf", "merge", { multiple: true }),
  "split-pdf": server("split-pdf", "pdf", "split"),
  "jpg-to-pdf": server("jpg-to-pdf", "pdf", "jpg-to-pdf", { accept: "image/*", multiple: true }),
  "pdf-to-jpg": browser("pdf-to-jpg", "application/pdf", "browser-artifact", ["pdfjs", "canvas", "jszip"]),
  "compress-pdf": server("compress-pdf", "pdf", "compress"),
  "rotate-pdf": server("rotate-pdf", "pdf", "rotate"),
  "watermark-pdf": server("watermark-pdf", "pdf", "watermark"),
  "image-compressor": server("image-compressor", "image", "compress"),
  "resize-image": server("resize-image", "image", "resize"),
  "image-converter": server("image-converter", "image", "convert"),
  "crop-image": server("crop-image", "image", "crop"),
  "rotate-image": server("rotate-image", "image", "rotate"),
  "watermark-image": server("watermark-image", "image", "watermark"),
  "image-ocr": browser("image-ocr", "image/*", "text", ["tesseract.js", "browser-wasm"]),
  "batch-resize": server("batch-resize", "image", "batch-resize", { multiple: true }),
  "grayscale-image": server("grayscale-image", "image", "grayscale"),
  "palette-extract": server("palette-extract", "image", "palette", { output: "json" }),
  stt: browser("stt", "audio/*", "text", ["browser-audio", "transformers.js", "whisper-tiny.en"]),
});

export function fileToolCapability(id: string): FileToolCapability | undefined {
  return FILE_TOOL_CAPABILITIES[id];
}

export function requireServerFileCapability(id: string): FileToolCapability & {
  runtime: "server-multipart";
  server: NonNullable<FileToolCapability["server"]>;
} {
  const capability = fileToolCapability(id);
  if (
    !capability ||
    capability.availability.status !== "registered" ||
    capability.runtime !== "server-multipart" ||
    !capability.server
  ) {
    throw new Error(`File tool "${id}" is unavailable`);
  }
  return capability as FileToolCapability & {
    runtime: "server-multipart";
    server: NonNullable<FileToolCapability["server"]>;
  };
}

const serverOperations = (family: ServerFileFamily): readonly string[] =>
  Object.freeze(
    Object.values(FILE_TOOL_CAPABILITIES)
      .filter((entry) => entry.server?.family === family)
      .map((entry) => entry.server!.operation),
  );

export const SERVER_IMAGE_OPERATIONS = serverOperations("image");
export const SERVER_PDF_OPERATIONS = serverOperations("pdf");

export function isRegisteredServerOperation(family: ServerFileFamily, operation: string): boolean {
  const operations = family === "image" ? SERVER_IMAGE_OPERATIONS : SERVER_PDF_OPERATIONS;
  return operations.includes(operation);
}
