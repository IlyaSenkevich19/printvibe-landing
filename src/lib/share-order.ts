import { business } from "@/content/business";

export type ShareResult = "shared" | "cancelled" | "fallback";

export function canShareFiles(files: File[]) {
  return typeof navigator !== "undefined" && !!navigator.canShare?.({ files });
}

/**
 * Must be called synchronously from a click handler: Safari rejects navigator.share()
 * and browsers block window.open() once the user gesture has expired.
 */
export function shareOrder({
  files,
  text,
  download,
}: {
  files: File[];
  text: string;
  download?: File;
}): Promise<ShareResult> {
  if (canShareFiles(files)) {
    return navigator
      .share({ files, text })
      .then(() => "shared" as const)
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return "cancelled" as const;
        return fallback(text, download);
      });
  }
  return fallback(text, download);
}

function fallback(text: string, download?: File): Promise<ShareResult> {
  const copied = navigator.clipboard?.writeText(text) ?? Promise.resolve();
  if (download) {
    const url = URL.createObjectURL(download);
    const a = document.createElement("a");
    a.href = url;
    a.download = download.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
  window.open(business.telegram.url, "_blank", "noopener");
  return copied.then(
    () => "fallback" as const,
    () => "fallback" as const,
  );
}
