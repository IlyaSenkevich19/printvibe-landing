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
import { printNote, products, type PrintSide } from "./try-on/catalog";
import { TryOnControls } from "./try-on/Controls";
import { Mockup } from "./try-on/Mockup";

export function TryOn() {
  const [productId, setProductId] = useState<ProductId>("tshirt");
  const [side, setSide] = useState<PrintSide>("front");
  const [colorId, setColorId] = useState("white");
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(false);
  const [mockup, setMockup] = useState<File | null>(null);
  const [shareStatus, setShareStatus] = useState<ShareResult | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [x, setX] = useState(10);
  const [y, setY] = useState(3);
  const [w, setW] = useState(80);
  const [h, setH] = useState(80);
  const [error, setError] = useState<string | null>(null);

  const product = products.find((item) => item.id === productId) ?? products[0]!;
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];
  const placement = product.back ? (side === "back" ? "спина" : "грудь") : "";
  const caption = `${product.name}${color ? `, ${color.name.toLowerCase()}` : ""}${placement ? `, ${placement}` : ""}`;

  useEffect(() => onTryOnRequest(setProductId), []);
  useEffect(() => {
    setSide("front");
    setX(10);
    setY(productId === "sticker" ? 10 : 3);
    setW(80);
    setH(80);
  }, [productId]);
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
              new File(
                [png],
                `printvibe-${product.id}${product.back ? `-${side}` : ""}${color ? `-${color.id}` : ""}.png`,
                {
                  type: "image/png",
                },
              ),
            );
          }
        })
        .catch(() => {});
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [design, product.id, product.back, side, color, caption, x, y, w, h]);

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
            Загрузите логотип, рисунок или фото и примерьте на изделие — на груди или на спине. Файл
            никуда не отправляется — превью строится прямо в браузере. Лучше прислать JPG или PNG.
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
            side={side}
            onSide={setSide}
            fileName={design?.name}
            fileSize={design?.file.size}
            previewUrl={design?.preview?.url}
            busy={loading}
            error={error}
            onFile={(file) => void acceptFile(file)}
            onClear={() => {
              setError(null);
              setShareStatus(null);
              setMockup(null);
              setDesign(null);
            }}
            x={x}
            y={y}
            w={w}
            h={h}
            onX={setX}
            onY={setY}
            onWidth={(value) => {
              setW(value);
              setX((left) => Math.min(left, 100 - value));
            }}
            onHeight={(value) => {
              setH(value);
              setY((top) => Math.min(top, 100 - value));
            }}
            canPlace={design?.preview != null}
            canSend={design !== null}
            onSend={send}
            shareStatus={shareStatus}
            withPreview={mockup !== null}
          />

          <div className="order-1 lg:order-2">
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="eyebrow min-w-0 text-ink/60">
                {product.name}
                {color && ` · ${color.name.toLowerCase()}`}
              </p>
              <p className="eyebrow max-w-[55%] text-right text-ink/60">
                {printNote(product, product.back ? side : "front")}
              </p>
            </div>
            <div className="relative aspect-square w-full overflow-hidden border-2 border-ink bg-card">
              <div
                aria-hidden
                className="halftone absolute inset-0 text-ink/10 [mask-image:radial-gradient(circle,transparent_35%,black)]"
              />
              <Mockup
                svgRef={svgRef}
                product={product}
                side={product.back ? side : "front"}
                color={color}
                design={design?.preview?.url}
                x={x / 100}
                y={y / 100}
                w={w / 100}
                h={h / 100}
                onPlace={(nextX, nextY, nextW, nextH) => {
                  setX(Math.round(nextX * 100));
                  setY(Math.round(nextY * 100));
                  setW(Math.round(nextW * 100));
                  setH(Math.round(nextH * 100));
                }}
              />
              <CropMarks className="m-6" />
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
