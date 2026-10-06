import { useId, type ReactNode } from "react";
import { business } from "@/content/business";
import type { ProductId } from "@/lib/try-on";
import type { ShareResult } from "@/lib/share-order";
import { TelegramIcon } from "../icons";
import { Uploader } from "../Uploader";
import type { Fabric, Product } from "./catalog";

export function TryOnControls({
  products,
  product,
  productId,
  onProduct,
  color,
  onColor,
  fileName,
  busy,
  error,
  onFile,
  scale,
  onScale,
  offset,
  onOffset,
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
  fileName: string | undefined;
  busy: boolean;
  error: string | null;
  onFile: (file: File) => void;
  scale: number;
  onScale: (value: number) => void;
  offset: number;
  onOffset: (value: number) => void;
  canSend: boolean;
  onSend: () => void;
  shareStatus: ShareResult | null;
  withPreview: boolean;
}) {
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

      <Field legend="Ваш дизайн">
        <Uploader busy={busy} fileName={fileName} onFile={onFile} />
        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Range label="Размер" value={scale} min={40} max={100} onChange={onScale} />
        {product.id !== "sticker" && (
          <Range label="Положение" value={offset} min={0} max={100} onChange={onOffset} />
        )}
      </div>

      <div className="border-t border-ink/15 pt-6">
        {canSend ? (
          <button
            type="button"
            onClick={onSend}
            disabled={busy}
            className="btn btn-primary w-full disabled:opacity-60 sm:w-auto"
          >
            <TelegramIcon />
            Отправить макет в Telegram
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
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
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
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-violet"
      />
    </div>
  );
}
