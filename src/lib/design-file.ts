export const MAX_DESIGN_MB = 50;

export type Design = {
  file: File;
  name: string;
  /** Present when the browser can show the file (possibly after HEIC → JPEG conversion). */
  preview?: { blob: Blob; url: string; aspect: number };
};

const documentExtensions = ["pdf", "ai", "eps", "psd", "cdr", "tif", "tiff"];
const heicExtensions = ["heic", "heif"];

const extension = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

export const fileLabel = (name: string) => extension(name).toUpperCase() || "файл";

/** Width divided by height, or null when the browser cannot show the image. */
function measure(blob: Blob): Promise<number | null> {
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.src = url;
  return img
    .decode()
    .then(() =>
      img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : null,
    )
    .catch(() => null)
    .finally(() => URL.revokeObjectURL(url));
}

function preview(blob: Blob, aspect: number) {
  return { blob, url: URL.createObjectURL(blob), aspect };
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

  const aspect = isImage ? await measure(file) : null;
  if (aspect) return { file, name: file.name, preview: preview(file, aspect) };

  if (isHeic) {
    try {
      const { heicTo } = await import("heic-to");
      const jpeg = await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
      return { file, name: file.name, preview: preview(jpeg, (await measure(jpeg)) ?? 1) };
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
