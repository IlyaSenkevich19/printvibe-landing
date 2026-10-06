import { useEffect, useId, useState, type ReactNode } from "react";
import { business } from "@/content/business";
import type { ProductId } from "@/lib/try-on";
import { browserCanShareFiles, type ShareResult } from "@/lib/share-order";
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
  x,
  y,
  w,
  h,
  onX,
  onY,
  onWidth,
  onHeight,
  canPlace,
  canSend,
  onSend,
  shareStatus,
  withPreview,
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
  x: number;
  y: number;
  w: number;
  h: number;
  onX: (value: number) => void;
  onY: (value: number) => void;
  onWidth: (value: number) => void;
  onHeight: (value: number) => void;
  canPlace: boolean;
  canSend: boolean;
  onSend: () => void;
  shareStatus: ShareResult | null;
  withPreview: boolean;
}) {
  const [sharesFiles, setSharesFiles] = useState<boolean | null>(null);
  useEffect(() => {
    setSharesFiles(browserCanShareFiles());
  }, []);

  return (
    <div className="order-2 space-y-8 lg:order-1">
      <Field legend="Изделие">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
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
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <Range label="Ширина" value={w} min={20} max={100} onChange={onWidth} />
            <Range label="Высота" value={h} min={20} max={100} onChange={onHeight} />
            <Range
              label="Слева"
              value={x}
              min={0}
              max={Math.max(0, 100 - w)}
              disabled={w === 100}
              onChange={onX}
            />
            <Range
              label="Сверху"
              value={y}
              min={0}
              max={Math.max(0, 100 - h)}
              disabled={h === 100}
              onChange={onY}
            />
          </div>
          <p className="text-sm text-ink/60">
            {w === 100 && h === 100
              ? "Принт на всю зону. Потяните уголок внутрь, чтобы уменьшить."
              : "Потяните принт, чтобы сдвинуть. Уголок меняет ширину и высоту, противоположный остаётся на месте."}
          </p>
        </>
      )}

      <div className="border-t border-ink/15 pt-6">
        {canSend ? (
          <button
            type="button"
            onClick={onSend}
            disabled={busy}
            className="btn btn-primary w-full disabled:opacity-60 sm:w-auto"
          >
            <TelegramIcon />
            {sharesFiles ? "Отправить макет в Telegram" : "Открыть Telegram с заказом"}
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
        <ShareStatus status={shareStatus} fileName={fileName} withPreview={withPreview} />
        {canSend && sharesFiles === false && shareStatus !== "fallback" && (
          <p className="mt-4 text-sm text-ink/60">
            Браузер скачает превью и откроет чат. Файл и превью нужно прикрепить к сообщению
            вручную.
          </p>
        )}
        <p className="mt-4 text-sm text-ink/60">
          Визуализация примерная: точный размер, место и цвета согласуем перед печатью.
        </p>
      </div>
    </div>
  );
}

function ShareStatus({
  status,
  fileName,
  withPreview,
}: {
  status: ShareResult | null;
  fileName: string | undefined;
  withPreview: boolean;
}) {
  if (status !== "fallback") return null;
  const file = fileName ? `ваш файл «${fileName}»` : "ваш файл";
  return (
    <p role="status" className="mt-4 border-l-4 border-violet bg-card px-4 py-3 text-sm">
      Открыли чат в Telegram и скопировали текст заказа.{" "}
      {withPreview
        ? `Превью на изделии скачалось — прикрепите его и ${file} к сообщению и вставьте текст.`
        : `Прикрепите ${file} к сообщению и вставьте текст.`}
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

function Range({
  label,
  value,
  min,
  max,
  disabled = false,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="eyebrow flex justify-between text-ink/60">
        {label}
        <span className="text-ink">{value}%</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-11 w-full cursor-pointer accent-violet disabled:cursor-default disabled:opacity-40"
      />
    </div>
  );
}
