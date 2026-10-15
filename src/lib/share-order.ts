import { business } from "@/content/business";

export type ShareResult = "shared" | "cancelled" | "fallback";

function canShare(file: File) {
  return typeof navigator !== "undefined" && !!navigator.canShare?.({ files: [file] });
}

/** True when this browser can hand a .zip to the system share sheet (Safari does, Chrome does not). */
export function browserCanShareArchive() {
  if (typeof navigator === "undefined" || typeof navigator.canShare !== "function") return false;
  try {
    return canShare(new File(["."], "order.zip", { type: "application/zip" }));
  } catch {
    return false;
  }
}

/**
 * Must be called synchronously from a click handler: Safari rejects navigator.share()
 * and browsers block window.open() once the user gesture has expired.
 */
export function shareOrder({
  archive,
  text,
}: {
  archive: File;
  text: string;
}): Promise<ShareResult> {
  if (canShare(archive)) {
    return navigator
      .share({ files: [archive], text })
      .then(() => "shared" as const)
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return "cancelled" as const;
        return fallback(text, archive);
      });
  }
  return fallback(text, archive);
}

function fallback(text: string, archive: File): Promise<ShareResult> {
  const copied = navigator.clipboard?.writeText(text) ?? Promise.resolve();
  const url = URL.createObjectURL(archive);
  const a = document.createElement("a");
  a.href = url;
  a.download = archive.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  window.open(business.telegram.url, "_blank", "noopener");
  return copied.then(
    () => "fallback" as const,
    () => "fallback" as const,
  );
}
