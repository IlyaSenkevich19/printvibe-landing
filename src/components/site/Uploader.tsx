import { useState } from "react";
import { fileLabel } from "@/lib/design-file";

const HINT =
  "Лучше JPG или PNG — превью откроется сразу. HEIC тоже примем, но файл тяжёлый и готовится дольше. Ещё: SVG, PDF, AI, PSD, CDR.";

function FileInput({
  busy,
  label,
  onFile,
  className = "",
}: {
  busy: boolean;
  label: string;
  onFile: (file: File) => void;
  className?: string;
}) {
  return (
    <input
      type="file"
      disabled={busy}
      aria-label={label}
      className={`design-file disabled:cursor-wait ${className}`}
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file && !busy) onFile(file);
      }}
    />
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
  const mb = bytes / (1024 * 1024);
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} МБ`;
}

export function Uploader({
  busy = false,
  fileName,
  fileSize,
  previewUrl,
  onFile,
  onClear,
}: {
  busy?: boolean;
  fileName?: string | undefined;
  fileSize?: number | undefined;
  previewUrl?: string | undefined;
  onFile: (file: File) => void;
  onClear?: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const chosen = Boolean(fileName);

  return (
    <div
      className={`flex w-full flex-col gap-4 border-2 border-dashed px-4 py-5 transition-colors ${
        dragging ? "border-violet bg-violet-soft" : "border-ink/40 bg-card"
      } ${busy ? "opacity-70" : ""}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && !busy) onFile(file);
      }}
    >
      {chosen && fileName ? (
        <div className="flex flex-col items-start gap-4 text-left min-[30rem]:flex-row min-[30rem]:items-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="size-24 shrink-0 border-2 border-ink bg-paper object-contain"
            />
          ) : (
            <span className="grid size-24 shrink-0 place-items-center border-2 border-ink bg-paper font-display text-2xl">
              {fileLabel(fileName)}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-semibold break-all">{busy ? "Открываем файл…" : fileName}</p>
            <p className="mt-1 text-sm text-ink/60">
              {fileLabel(fileName)}
              {fileSize !== undefined ? ` · ${formatSize(fileSize)}` : ""}
              {previewUrl ? "" : " · на сайте без превью, файл всё равно отправим"}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <FileInput busy={busy} label={`Заменить файл ${fileName}`} onFile={onFile} />
              {onClear && !busy && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-sm font-semibold text-violet underline-offset-4 hover:underline"
                >
                  Убрать макет
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold">{busy ? "Открываем файл…" : "Загрузить макет"}</p>
          <p className="mt-1 text-sm text-balance text-ink/60">
            Перетащите файл на рамку или нажмите кнопку
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-balance text-ink/60">{HINT}</p>
          <FileInput busy={busy} label="Выбрать файл макета" onFile={onFile} className="mt-4" />
        </div>
      )}
    </div>
  );
}
