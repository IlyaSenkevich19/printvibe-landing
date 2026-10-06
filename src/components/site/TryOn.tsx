import { useEffect, useRef, useState } from "react";
import {
  DesignError,
  fileLabel,
  prepareDesign,
  releaseDesign,
  type Design,
} from "@/lib/design-file";
import { renderMockupPng } from "@/lib/mockup-export";
import { shareOrder, type ShareResult } from "@/lib/share-order";
import { onTryOnRequest, type ProductId } from "@/lib/try-on";
import { CropMarks } from "./print-marks";
import { products } from "./try-on/catalog";
import { TryOnControls } from "./try-on/Controls";
import { Mockup } from "./try-on/Mockup";

export function TryOn() {
  const [productId, setProductId] = useState<ProductId>("tshirt");
  const [colorId, setColorId] = useState("white");
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(false);
  const [mockup, setMockup] = useState<File | null>(null);
  const [shareStatus, setShareStatus] = useState<ShareResult | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(80);
  const [offset, setOffset] = useState(15);
  const [error, setError] = useState<string | null>(null);

  const product = products.find((item) => item.id === productId) ?? products[0]!;
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];
  const caption = `${product.name}${color ? `, ${color.name.toLowerCase()}` : ""}`;

  useEffect(() => onTryOnRequest(setProductId), []);
  useEffect(() => () => releaseDesign(design), [design]);

  useEffect(() => {
    setMockup(null);
    const svg = svgRef.current;
    const preview = design?.preview;
    if (!svg || !preview) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      renderMockupPng(svg, preview.blob, caption)
        .then((png) => {
          if (!cancelled) {
            setMockup(
              new File([png], `printvibe-${product.id}${color ? `-${color.id}` : ""}.png`, {
                type: "image/png",
              }),
            );
          }
        })
        .catch(() => {});
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [design, product.id, color, caption, scale, offset]);

  const acceptFile = async (file: File) => {
    setError(null);
    setShareStatus(null);
    setLoading(true);
    try {
      setDesign(await prepareDesign(file));
    } catch (e) {
      setError(
        e instanceof DesignError ? e.message : "Не получилось открыть файл. Попробуйте другой.",
      );
    } finally {
      setLoading(false);
    }
  };

  const send = () => {
    if (!design) return;
    const files = mockup ? [mockup, design.file] : [design.file];
    const text = [
      "Здравствуйте! Хочу заказать печать в PrintVibe.",
      `Изделие: ${caption}.`,
      `Мой макет: ${design.name}${mockup ? ", превью на изделии — во вложении" : ""}.`,
    ].join("\n");
    shareOrder({ files, text, ...(mockup && { download: mockup }) }).then(setShareStatus);
  };

  return (
    <section
      id="try"
      aria-labelledby="try-title"
      className="relative border-y-2 border-ink bg-paper-deep py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-violet">Примерочная</p>
            <h2 id="try-title" className="mt-3 font-display text-4xl leading-none md:text-6xl">
              Посмотрите, как будет выглядеть
            </h2>
          </div>
          <p className="max-w-sm text-ink/70">
            Загрузите логотип, рисунок или фото и примерьте на изделие. Файл никуда не отправляется
            — превью строится прямо в браузере.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
          <TryOnControls
            products={products}
            product={product}
            productId={productId}
            onProduct={setProductId}
            color={color}
            onColor={setColorId}
            fileName={design?.name}
            busy={loading}
            error={error}
            onFile={(file) => void acceptFile(file)}
            scale={scale}
            onScale={setScale}
            offset={offset}
            onOffset={setOffset}
            canSend={design !== null}
            onSend={send}
            shareStatus={shareStatus}
            withPreview={mockup !== null}
          />

          <div className="order-1 lg:order-2">
            <div className="relative aspect-square w-full overflow-hidden border-2 border-ink bg-card">
              <div
                aria-hidden
                className="halftone absolute inset-0 text-ink/10 [mask-image:radial-gradient(circle,transparent_35%,black)]"
              />
              <Mockup
                svgRef={svgRef}
                product={product}
                color={color}
                design={design?.preview?.url}
                scale={scale / 100}
                offset={offset / 100}
              />
              <CropMarks className="m-6" />
              <p className="eyebrow absolute top-4 left-4 text-ink/60">
                {product.name}
                {color && ` · ${color.name.toLowerCase()}`}
              </p>
              <p className="eyebrow absolute right-4 bottom-4 text-ink/60">{product.note}</p>
              {design && !design.preview && (
                <div className="absolute inset-x-6 bottom-14 border-2 border-ink bg-card p-4 text-sm shadow-[4px_4px_0_0_var(--orange)]">
                  <p className="font-semibold">
                    Файл {fileLabel(design.name)} принят — превью для этого формата недоступно.
                  </p>
                  <p className="mt-1 text-ink/70">
                    Отправьте его нам — покажем, как макет ляжет на изделие.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
