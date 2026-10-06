export const MAX_DESIGN_MB = 50;

export type Design = {
  file: File;
  name: string;
  /** Present when the browser can show the file (possibly after HEIC → JPEG conversion). */
  preview?: { blob: Blob; url: string };
};

export const DESIGN_ACCEPT = "image/*,.heic,.heif,.pdf,.ai,.eps,.psd,.cdr,.tif,.tiff,.svg";

const documentExtensions = ["pdf", "ai", "eps", "psd", "cdr", "tif", "tiff"];
const heicExtensions = ["heic", "heif"];

const extension = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

export const fileLabel = (name: string) => extension(name).toUpperCase() || "файл";

function canDisplay(blob: Blob): Promise<boolean> {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  return img
    .decode()
    .then(() => img.naturalWidth > 0)
    .catch(() => false)
    .finally(() => URL.revokeObjectURL(url));
}

export class DesignError extends Error {}

export async function prepareDesign(file: File): Promise<Design> {
  if (file.size > MAX_DESIGN_MB * 1024 * 1024) {
    throw new DesignError(
      `Файл больше ${MAX_DESIGN_MB} МБ. Отправьте его нам в Telegram как документ — посмотрим вручную.`,
    );
  }

  const ext = extension(file.name);
  const isHeic = heicExtensions.includes(ext) || /image\/hei[cf]/.test(file.type);
  const isImage = file.type.startsWith("image/") || isHeic;
  const isDocument = documentExtensions.includes(ext);

  if (!isImage && !isDocument) {
    throw new DesignError(
      "Этот формат не подходит. Можно: JPG, PNG, WEBP, SVG, HEIC, PDF, AI, EPS, PSD, CDR, TIFF.",
    );
  }

  if (isImage && (await canDisplay(file))) {
    return { file, name: file.name, preview: { blob: file, url: URL.createObjectURL(file) } };
  }

  if (isHeic) {
    try {
      const { heicTo } = await import("heic-to");
      const jpeg = await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
      return { file, name: file.name, preview: { blob: jpeg, url: URL.createObjectURL(jpeg) } };
    } catch {
      throw new DesignError(
        "Не получилось открыть фото HEIC. Пересохраните его в JPG или отправьте нам как есть.",
      );
    }
  }

  return { file, name: file.name };
}

export function releaseDesign(design: Design | null) {
  if (design?.preview) URL.revokeObjectURL(design.preview.url);
}
