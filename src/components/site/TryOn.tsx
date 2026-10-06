import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  DESIGN_ACCEPT,
  DesignError,
  fileLabel,
  prepareDesign,
  releaseDesign,
  type Design,
} from "@/lib/design-file";
import { renderMockupPng } from "@/lib/mockup-export";
import { shareOrder, type ShareResult } from "@/lib/share-order";
import { business } from "@/content/business";
import { onTryOnRequest, type ProductId } from "@/lib/try-on";
import { TelegramIcon } from "./icons";
import { CropMarks } from "./print-marks";

type Fabric = { id: string; name: string; fill: string; light: boolean };

const fabrics: Fabric[] = [
  { id: "white", name: "Белый", fill: "#f4f3ef", light: true },
  { id: "black", name: "Чёрный", fill: "#1f1d22", light: false },
  { id: "melange", name: "Серый меланж", fill: "#b8b6b1", light: true },
  { id: "beige", name: "Бежевый", fill: "#d8c6a6", light: true },
  { id: "violet", name: "Фиолетовый", fill: "#4b1fb8", light: false },
];

const mugColors: Fabric[] = [
  { id: "white", name: "Белая", fill: "#f7f7f5", light: true },
  { id: "black", name: "Чёрная", fill: "#232126", light: false },
];

type Area = { x: number; y: number; w: number; h: number };

type Product = {
  id: ProductId;
  name: string;
  colors: Fabric[];
  area: Area;
  note: string;
};

const products: Product[] = [
  {
    id: "tshirt",
    name: "Футболка",
    colors: fabrics,
    area: { x: 170, y: 128, w: 160, h: 200 },
    note: "Принт на груди",
  },
  {
    id: "hoodie",
    name: "Худи",
    colors: fabrics,
    area: { x: 178, y: 150, w: 144, h: 150 },
    note: "Принт на груди, над карманом",
  },
  {
    id: "mug",
    name: "Кружка",
    colors: mugColors,
    area: { x: 138, y: 150, w: 184, h: 210 },
    note: "Печать по кругу кружки",
  },
  {
    id: "sticker",
    name: "Наклейка",
    colors: [],
    area: { x: 120, y: 110, w: 260, h: 260 },
    note: "Вырубная наклейка с белой каймой",
  },
];

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
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const product = products.find((p) => p.id === productId) ?? products[0]!;
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];

  useEffect(() => onTryOnRequest(setProductId), []);

  useEffect(() => () => releaseDesign(design), [design]);

  const caption = `${product.name}${color ? `, ${color.name.toLowerCase()}` : ""}`;

  // Pre-rendered so the share sheet can open synchronously inside the click handler.
  useEffect(() => {
    setMockup(null);
    const svg = svgRef.current;
    const preview = design?.preview;
    if (!svg || !preview) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      renderMockupPng(svg, preview.blob, caption)
        .then((png) => {
          if (!cancelled)
            setMockup(
              new File([png], `printvibe-${product.id}${color ? `-${color.id}` : ""}.png`, {
                type: "image/png",
              }),
            );
        })
        .catch(() => {});
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [design, product.id, color, caption, scale, offset]);

  const acceptFile = async (file: File | undefined) => {
    if (!file) return;
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

  const orderText = design
    ? [
        "Здравствуйте! Хочу заказать печать в PrintVibe.",
        `Изделие: ${caption}.`,
        `Мой макет: ${design.name}${mockup ? ", превью на изделии — во вложении" : ""}.`,
      ].join("\n")
    : "";

  const send = () => {
    if (!design) return;
    const files = mockup ? [mockup, design.file] : [design.file];
    shareOrder({ files, text: orderText, ...(mockup && { download: mockup }) }).then(
      setShareStatus,
    );
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
          <div className="order-2 space-y-8 lg:order-1">
            <Field legend="Изделие">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {products.map((p) => (
                  <label
                    key={p.id}
                    className="cursor-pointer border-2 border-ink bg-card px-3 py-3 text-center font-semibold transition-colors has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-3 has-focus-visible:outline-violet"
                  >
                    <input
                      type="radio"
                      name="product"
                      value={p.id}
                      checked={productId === p.id}
                      onChange={() => setProductId(p.id)}
                      className="sr-only"
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </Field>

            {product.colors.length > 0 && (
              <Field legend={`Цвет — ${color?.name ?? ""}`}>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <label
                      key={c.id}
                      title={c.name}
                      className="grid size-11 cursor-pointer place-items-center rounded-full border-2 border-ink/20 transition-transform hover:scale-110 has-checked:border-ink has-checked:ring-2 has-checked:ring-violet has-checked:ring-offset-2 has-checked:ring-offset-paper-deep has-focus-visible:ring-2 has-focus-visible:ring-violet"
                      style={{ background: c.fill }}
                    >
                      <input
                        type="radio"
                        name="color"
                        value={c.id}
                        checked={color?.id === c.id}
                        onChange={() => setColorId(c.id)}
                        className="sr-only"
                      />
                      <span className="sr-only">{c.name}</span>
                    </label>
                  ))}
                </div>
              </Field>
            )}

            <Field legend="Ваш дизайн">
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  void acceptFile(e.dataTransfer.files[0]);
                }}
                className={`flex w-full cursor-pointer flex-col items-center gap-1 border-2 border-dashed px-4 py-6 text-center transition-colors has-focus-visible:outline-3 has-focus-visible:outline-violet ${
                  dragging
                    ? "border-violet bg-violet-soft"
                    : "border-ink/40 bg-card hover:border-ink"
                }`}
              >
                <input
                  type="file"
                  accept={DESIGN_ACCEPT}
                  className="sr-only"
                  onChange={(e) => {
                    void acceptFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <span className="font-semibold">
                  {loading ? "Открываем файл…" : design ? "Заменить файл" : "Загрузить макет"}
                </span>
                <span className="text-sm break-all text-ink/60">
                  {design
                    ? design.name
                    : "нажмите или перетащите сюда · JPG, PNG, HEIC, SVG, PDF, AI, PSD, CDR"}
                </span>
              </label>
              {error && (
                <p role="alert" className="mt-2 text-sm font-medium text-destructive">
                  {error}
                </p>
              )}
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Range label="Размер" value={scale} min={40} max={100} onChange={setScale} />
              {product.id !== "sticker" && (
                <Range label="Положение" value={offset} min={0} max={100} onChange={setOffset} />
              )}
            </div>

            <div className="border-t border-ink/15 pt-6">
              {design ? (
                <button
                  type="button"
                  onClick={send}
                  disabled={loading}
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
              <ShareStatus status={shareStatus} fileName={design?.name} withPreview={!!mockup} />
              <p className="mt-4 text-sm text-ink/60">
                Визуализация примерная: точный размер, место и цвета согласуем перед печатью.
              </p>
            </div>
          </div>

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
  onChange: (v: number) => void;
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

function placeDesign(area: Area, scale: number, offset: number) {
  const w = area.w * scale;
  const h = area.h * scale;
  return { x: area.x + (area.w - w) / 2, y: area.y + (area.h - h) * offset, w, h };
}

function DesignLayer({
  url,
  box,
  blend,
}: {
  url: string | undefined;
  box: Area;
  blend: "multiply" | "normal";
}) {
  return (
    <svg x={box.x} y={box.y} width={box.w} height={box.h} viewBox="0 0 100 100" overflow="visible">
      {url ? (
        <image
          href={url}
          width="100"
          height="100"
          preserveAspectRatio="xMidYMid meet"
          style={{ mixBlendMode: blend }}
        />
      ) : (
        <SampleArt />
      )}
    </svg>
  );
}

function SampleArt() {
  return (
    <g>
      <circle cx="50" cy="44" r="34" fill="var(--orange)" />
      <polygon points="8,52 92,52 86,72 8,72" fill="var(--violet)" />
      <text
        x="48"
        y="67.5"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="15"
        fill="#fff"
      >
        ВАШ
      </text>
      <text
        x="50"
        y="90"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="13"
        fill="var(--ink)"
        stroke="#fff"
        strokeWidth="0.6"
        paintOrder="stroke"
      >
        ДИЗАЙН
      </text>
      <text
        x="50"
        y="38"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="18"
        fill="var(--ink)"
      >
        ✶
      </text>
    </g>
  );
}

const shapes = {
  tshirt: {
    body: "M185 45 Q250 100 315 45 L400 75 L465 165 L405 195 L385 165 L385 455 Q250 468 115 455 L115 165 L95 195 L35 165 L100 75 Z",
    details: (
      <>
        <path d="M185 45 Q250 100 315 45" fill="none" strokeWidth="11" />
        <path d="M115 165 L100 75 M385 165 L400 75" fill="none" strokeWidth="1.5" opacity="0.35" />
        <path d="M405 195 L465 165 M95 195 L35 165" fill="none" strokeWidth="6" opacity="0.4" />
      </>
    ),
    folds: "M150 360 Q190 390 170 440 M330 330 Q300 380 335 430 M240 380 Q250 420 230 455",
  },
  hoodie: {
    body: "M180 62 Q250 125 320 62 L395 92 Q440 150 455 300 L460 435 L415 440 L405 300 L390 215 L390 455 Q250 468 110 455 L110 215 L95 300 L85 440 L40 435 L45 300 Q60 150 105 92 Z",
    hood: "M168 72 Q250 -12 332 72 Q305 128 250 132 Q195 128 168 72 Z",
    details: (
      <>
        <path d="M168 72 Q250 -12 332 72" fill="none" strokeWidth="2" opacity="0.35" />
        <path d="M180 62 Q250 125 320 62" fill="none" strokeWidth="10" />
        <path
          d="M228 108 L222 185 M272 108 L278 185"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M172 330 L328 330 L348 420 L152 420 Z"
          fill="none"
          strokeWidth="2.5"
          opacity="0.5"
        />
        <path d="M110 440 L390 440" fill="none" strokeWidth="14" opacity="0.25" />
        <path d="M40 425 L85 430 M415 430 L460 425" fill="none" strokeWidth="12" opacity="0.3" />
      </>
    ),
    folds: "M140 300 Q170 340 150 400 M355 290 Q330 340 350 400 M120 140 Q150 180 130 220",
  },
};

function Mockup({
  svgRef,
  product,
  color,
  design,
  scale,
  offset,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  product: Product;
  color: Fabric | undefined;
  design: string | undefined;
  scale: number;
  offset: number;
}) {
  const uid = useId().replace(/:/g, "");
  const box = placeDesign(product.area, scale, product.id === "sticker" ? 0.5 : offset);
  const fill = color?.fill ?? "#fff";
  const light = color?.light ?? true;
  const blend = light ? "multiply" : "normal";
  const stroke = light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.14)";

  const label =
    product.id === "sticker"
      ? "Превью наклейки с вашим дизайном"
      : `Превью: ${product.name.toLowerCase()}, цвет ${color?.name.toLowerCase()}, с вашим дизайном`;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 500"
      role="img"
      aria-label={label}
      className="relative size-full transition-[filter] duration-300"
    >
      <defs>
        <filter id={`${uid}-noise`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.1"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
        </filter>
        <filter
          id={`${uid}-blur`}
          filterUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="500"
          height="500"
        >
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id={`${uid}-diecut`} x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="9" result="spread" />
          <feFlood floodColor="#fff" />
          <feComposite in2="spread" operator="in" result="outline" />
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.25" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${uid}-side`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.22" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={`${uid}-cyl`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.18" stopColor="#000" stopOpacity="0.05" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
          <stop offset="0.85" stopColor="#000" stopOpacity="0.15" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={`${uid}-hi`} cx="0.45" cy="0.3" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity={light ? 0.35 : 0.12} />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        cx="250"
        cy="468"
        rx="170"
        ry="14"
        fill="#000"
        opacity="0.12"
        filter={`url(#${uid}-blur)`}
      />

      {(product.id === "tshirt" || product.id === "hoodie") && (
        <Garment
          uid={uid}
          shape={shapes[product.id]}
          fill={fill}
          stroke={stroke}
          design={<DesignLayer url={design} box={box} blend={blend} />}
        />
      )}

      {product.id === "mug" && (
        <g>
          <path
            d="M350 175 C432 175 440 335 350 335"
            fill="none"
            stroke={fill}
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="M350 175 C432 175 440 335 350 335"
            fill="none"
            stroke="#000"
            strokeOpacity="0.15"
            strokeWidth="30"
            strokeLinecap="round"
          />
          <clipPath id={`${uid}-mug`}>
            <path d="M110 110 L110 382 Q110 412 230 412 Q350 412 350 382 L350 110 Z" />
          </clipPath>
          <path d="M110 110 L110 382 Q110 412 230 412 Q350 412 350 382 L350 110 Z" fill={fill} />
          <g clipPath={`url(#${uid}-mug)`}>
            <DesignLayer url={design} box={box} blend={blend} />
            <rect x="110" y="100" width="240" height="320" fill={`url(#${uid}-cyl)`} />
          </g>
          <ellipse cx="230" cy="110" rx="120" ry="22" fill={fill} />
          <ellipse cx="230" cy="110" rx="120" ry="22" fill="#000" opacity="0.06" />
          <ellipse cx="230" cy="112" rx="106" ry="16" fill="#000" opacity={light ? 0.22 : 0.45} />
        </g>
      )}

      {product.id === "sticker" && (
        <g transform="rotate(-6 250 250)" filter={`url(#${uid}-diecut)`}>
          {design ? (
            <image
              href={design}
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <svg x={box.x} y={box.y} width={box.w} height={box.h} viewBox="0 0 100 100">
              <SampleArt />
            </svg>
          )}
        </g>
      )}
    </svg>
  );
}

function Garment({
  uid,
  shape,
  fill,
  stroke,
  design,
}: {
  uid: string;
  shape: { body: string; hood?: string; details: ReactNode; folds: string };
  fill: string;
  stroke: string;
  design: ReactNode;
}) {
  return (
    <g>
      {shape.hood && <path d={shape.hood} fill={fill} />}
      {shape.hood && <path d={shape.hood} fill="#000" opacity="0.18" />}
      <clipPath id={`${uid}-body`}>
        <path d={shape.body} />
      </clipPath>
      <path d={shape.body} fill={fill} />
      <g clipPath={`url(#${uid}-body)`}>
        {design}
        <rect width="500" height="500" fill={`url(#${uid}-side)`} />
        <rect width="500" height="500" fill={`url(#${uid}-hi)`} />
        <path
          d={shape.folds}
          fill="none"
          stroke="#000"
          strokeOpacity="0.07"
          strokeWidth="16"
          filter={`url(#${uid}-blur)`}
        />
        <rect
          width="500"
          height="500"
          filter={`url(#${uid}-noise)`}
          opacity="0.12"
          style={{ mixBlendMode: "multiply" }}
        />
      </g>
      <g stroke={stroke}>{shape.details}</g>
    </g>
  );
}
