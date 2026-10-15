import { useEffect, useState, type ReactNode } from "react";
import { business } from "@/content/business";
import type { ProductId } from "@/lib/try-on";
import { browserCanShareArchive, type ShareResult } from "@/lib/share-order";
import { TelegramIcon } from "../icons";
import { Uploader } from "../Uploader";
import type { Fabric, PrintSide, Product } from "./catalog";

export function TryOnControls({
  products,
  product,
  productId,
  onProduct,
  color,
  onColor,
  side,
  onSide,
  fileName,
  fileSize,
  previewUrl,
  busy,
  error,
  onFile,
  onClear,
  canPlace,
  onReset,
  canSend,
  ready,
  onSend,
  shareStatus,
  archiveName,
}: {
  products: Product[];
  product: Product;
  productId: ProductId;
  onProduct: (id: ProductId) => void;
  color: Fabric | undefined;
  onColor: (id: string) => void;
  side: PrintSide;
  onSide: (side: PrintSide) => void;
  fileName: string | undefined;
  fileSize: number | undefined;
  previewUrl: string | undefined;
  busy: boolean;
  error: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
  canPlace: boolean;
  onReset: () => void;
  canSend: boolean;
  ready: boolean;
  onSend: () => void;
  shareStatus: ShareResult | null;
  archiveName: string;
}) {
  const [sharesFiles, setSharesFiles] = useState<boolean | null>(null);
  useEffect(() => {
    setSharesFiles(browserCanShareArchive());
  }, []);

  return (
    <div className="order-2 space-y-8 lg:order-1">
      <Field legend="Изделие">
        <div className="grid grid-cols-3 gap-2">
          {products.map((item) => (
            <label
              key={item.id}
              className="cursor-pointer border-2 border-ink bg-card px-3 py-3 text-center font-semibold transition-colors has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-3 has-focus-visible:outline-violet"
            >
              <input
                type="radio"
                name="product"
                value={item.id}
                checked={productId === item.id}
                onChange={() => onProduct(item.id)}
                className="sr-only"
              />
              {item.name}
            </label>
          ))}
        </div>
      </Field>

      {product.colors.length > 0 && (
        <Field legend={`Цвет — ${color?.name ?? ""}`}>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((item) => (
              <label
                key={item.id}
                title={item.name}
                className="grid size-11 cursor-pointer place-items-center rounded-full border-2 border-ink/20 transition-transform hover:scale-110 has-checked:border-ink has-checked:ring-2 has-checked:ring-violet has-checked:ring-offset-2 has-checked:ring-offset-paper-deep has-focus-visible:ring-2 has-focus-visible:ring-violet"
                style={{ background: item.fill }}
              >
                <input
                  type="radio"
                  name="color"
                  value={item.id}
                  checked={color?.id === item.id}
                  onChange={() => onColor(item.id)}
                  className="sr-only"
                />
                <span className="sr-only">{item.name}</span>
              </label>
            ))}
          </div>
        </Field>
      )}

      {product.back && (
        <Field legend="Сторона">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["front", "Грудь"],
                ["back", "Спина"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="cursor-pointer border-2 border-ink bg-card px-3 py-3 text-center font-semibold transition-colors has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-3 has-focus-visible:outline-violet"
              >
                <input
                  type="radio"
                  name="side"
                  value={value}
                  checked={side === value}
                  onChange={() => onSide(value)}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </Field>
      )}

      <Field legend="Ваш дизайн">
        <Uploader
          busy={busy}
          fileName={fileName}
          fileSize={fileSize}
          previewUrl={previewUrl}
          onFile={onFile}
          onClear={onClear}
        />
        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </Field>

      {canPlace && (
        <div className="flex flex-col items-start gap-2 border-l-4 border-violet bg-card px-4 py-3 text-sm">
          <p>
            Двигайте принт прямо на {product.id === "mug" ? "кружке" : "изделии"}. Тяните за уголок
            — размер меняется, пропорции картинки сохраняются.
            {product.id !== "mug" && " Растянуть можно до рукавов."}
          </p>
          <button
            type="button"
            onClick={onReset}
            className="font-semibold text-violet underline-offset-4 hover:underline"
          >
            Вернуть как было
          </button>
        </div>
      )}

      <div className="border-t border-ink/15 pt-6">
        {canSend ? (
          <button
            type="button"
            onClick={onSend}
            disabled={busy || !ready}
            className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            <TelegramIcon />
            {!ready
              ? "Готовим файл…"
              : sharesFiles
                ? "Отправить файлом в Telegram"
                : "Открыть Telegram с заказом"}
          </button>
        ) : (
          <a
            href={business.telegram.url}
            target="_blank"
            rel="noopener"
            className="btn btn-primary w-full sm:w-auto"
          >
            <TelegramIcon />
            Написать в Telegram
          </a>
        )}
        <ShareStatus status={shareStatus} archiveName={archiveName} />
        {canSend && shareStatus !== "fallback" && (
          <p className="mt-4 text-sm text-ink/60">
            {sharesFiles
              ? `Макет и превью уйдут одним архивом ${archiveName} — Telegram отправит его файлом, без сжатия.`
              : `Браузер скачает архив ${archiveName} с макетом и превью и откроет чат. Прикрепите архив к сообщению — он уйдёт файлом, без сжатия.`}
          </p>
        )}
        <p className="mt-4 text-sm text-ink/60">
          Визуализация примерная: точный размер, место и цвета согласуем перед печатью.
        </p>
      </div>
    </div>
  );
}

function ShareStatus({ status, archiveName }: { status: ShareResult | null; archiveName: string }) {
  if (status !== "fallback") return null;
  return (
    <p role="status" className="mt-4 border-l-4 border-violet bg-card px-4 py-3 text-sm">
      Открыли чат в Telegram и скопировали текст заказа. Архив {archiveName} скачался — прикрепите
      его к сообщению (скрепка → «Файл») и вставьте текст.
    </p>
  );
}

function Field({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-ink/60">{legend}</legend>
      {children}
    </fieldset>
  );
}
