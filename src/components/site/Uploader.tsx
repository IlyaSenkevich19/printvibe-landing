import { useState } from "react";

const FORMATS = "JPG, PNG, HEIC, SVG, PDF, AI, PSD, CDR";

export function Uploader({
  busy = false,
  fileName,
  onFile,
}: {
  busy?: boolean;
  fileName?: string | undefined;
  onFile: (file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={`flex w-full flex-col items-center gap-3 border-2 border-dashed px-4 py-6 text-center transition-colors ${
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
      <p className="font-semibold">
        {busy ? "Открываем файл…" : fileName ? "Файл выбран" : "Загрузить макет"}
      </p>
      <p className={`text-sm text-ink/60 ${fileName ? "break-all" : "text-balance"}`}>
        {fileName ? fileName : `перетащите файл на рамку или нажмите кнопку ниже · ${FORMATS}`}
      </p>
      <input
        type="file"
        disabled={busy}
        aria-label={fileName ? `Заменить файл ${fileName}` : "Выбрать файл макета"}
        className="block max-w-full cursor-pointer text-sm disabled:cursor-wait"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file && !busy) onFile(file);
        }}
      />
    </div>
  );
}
