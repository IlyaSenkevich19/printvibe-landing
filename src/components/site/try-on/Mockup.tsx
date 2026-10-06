import {
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  printArea,
  printNote,
  type Area,
  type Fabric,
  type PrintSide,
  type Product,
} from "./catalog";

function placeDesign(area: Area, scale: number, nx: number, ny: number) {
  const w = area.w * scale;
  const h = area.h * scale;
  return { x: area.x + (area.w - w) * nx, y: area.y + (area.h - h) * ny, w, h };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function Print({
  url,
  box,
  blend,
  canDrag,
  grabbing,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  url: string | undefined;
  box: Area;
  blend: "multiply" | "normal";
  canDrag: boolean;
  grabbing: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGGElement>) => void;
  onPointerUp: () => void;
}) {
  return (
    <g
      style={{
        cursor: canDrag ? (grabbing ? "grabbing" : "grab") : undefined,
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <DesignLayer url={url} box={box} blend={blend} />
      {canDrag && <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="transparent" />}
    </g>
  );
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

const garments = {
  tshirt: {
    front: {
      body: "M185 45 Q250 100 315 45 L400 75 L465 165 L405 195 L385 165 L385 455 Q250 468 115 455 L115 165 L95 195 L35 165 L100 75 Z",
      details: (
        <>
          <path d="M185 45 Q250 100 315 45" fill="none" strokeWidth="11" />
          <path
            d="M115 165 L100 75 M385 165 L400 75"
            fill="none"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <path d="M405 195 L465 165 M95 195 L35 165" fill="none" strokeWidth="6" opacity="0.4" />
        </>
      ),
      folds: "M150 360 Q190 390 170 440 M330 330 Q300 380 335 430 M240 380 Q250 420 230 455",
    },
    back: {
      body: "M200 58 Q250 82 300 58 L400 78 L465 165 L405 195 L385 165 L385 455 Q250 468 115 455 L115 165 L95 195 L35 165 L100 78 Z",
      details: (
        <>
          <path d="M200 58 Q250 82 300 58" fill="none" strokeWidth="8" />
          <path
            d="M115 165 L100 78 M385 165 L400 78"
            fill="none"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <path d="M405 195 L465 165 M95 195 L35 165" fill="none" strokeWidth="6" opacity="0.4" />
        </>
      ),
      folds: "M170 250 Q200 320 175 430 M330 240 Q300 330 335 430 M250 180 Q248 300 252 450",
    },
  },
  hoodie: {
    front: {
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
    back: {
      body: "M190 78 Q250 108 310 78 L395 100 Q440 155 455 300 L460 435 L415 440 L405 300 L390 215 L390 455 Q250 468 110 455 L110 215 L95 300 L85 440 L40 435 L45 300 Q60 155 105 100 Z",
      hood: "M165 88 Q250 8 335 88 Q310 48 250 42 Q190 48 165 88 Z",
      details: (
        <>
          <path d="M165 88 Q250 8 335 88" fill="none" strokeWidth="2" opacity="0.35" />
          <path d="M190 78 Q250 108 310 78" fill="none" strokeWidth="8" />
          <path d="M110 440 L390 440" fill="none" strokeWidth="14" opacity="0.25" />
          <path d="M40 425 L85 430 M415 430 L460 425" fill="none" strokeWidth="12" opacity="0.3" />
        </>
      ),
      folds: "M160 240 Q190 300 170 390 M340 230 Q310 300 330 390 M250 160 Q255 280 245 400",
    },
  },
};

export function Mockup({
  svgRef,
  product,
  side,
  color,
  design,
  scale,
  nx,
  ny,
  onMove,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  product: Product;
  side: PrintSide;
  color: Fabric | undefined;
  design: string | undefined;
  scale: number;
  nx: number;
  ny: number;
  onMove: (nx: number, ny: number) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const area = printArea(product, side);
  const box = placeDesign(area, scale, nx, ny);
  const fill = color?.fill ?? "#fff";
  const light = color?.light ?? true;
  const blend = product.id === "sticker" || !light ? "normal" : "multiply";
  const stroke = light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.14)";
  const freeX = area.w * (1 - scale);
  const freeY = area.h * (1 - scale);
  const canDrag = freeX > 1 || freeY > 1;
  const drag = useRef<{ px: number; py: number; nx: number; ny: number } | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const onPointerDown = (event: ReactPointerEvent<SVGGElement>) => {
    if (!canDrag) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { px: event.clientX, py: event.clientY, nx, ny };
    setGrabbing(true);
  };

  const onPointerMove = (event: ReactPointerEvent<SVGGElement>) => {
    const start = drag.current;
    const svg = svgRef.current;
    if (!start || !svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dx = ((event.clientX - start.px) / rect.width) * 500;
    const dy = ((event.clientY - start.py) / rect.height) * 500;
    onMove(
      freeX > 1 ? clamp(start.nx + dx / freeX, 0, 1) : start.nx,
      freeY > 1 ? clamp(start.ny + dy / freeY, 0, 1) : start.ny,
    );
  };

  const endDrag = () => {
    drag.current = null;
    setGrabbing(false);
  };

  const print = (
    <Print
      url={design}
      box={box}
      blend={blend}
      canDrag={canDrag}
      grabbing={grabbing}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
    />
  );

  const label =
    product.id === "sticker"
      ? "Превью наклейки с вашим дизайном. Принт можно перетащить."
      : `Превью: ${product.name.toLowerCase()}, ${printNote(product, side).toLowerCase()}, цвет ${color?.name.toLowerCase()}. Принт можно перетащить.`;

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
          shape={garments[product.id][side]}
          fill={fill}
          stroke={stroke}
          design={print}
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
            {print}
            <rect
              x="110"
              y="100"
              width="240"
              height="320"
              fill={`url(#${uid}-cyl)`}
              style={{ pointerEvents: "none" }}
            />
          </g>
          <ellipse cx="230" cy="110" rx="120" ry="22" fill={fill} />
          <ellipse cx="230" cy="110" rx="120" ry="22" fill="#000" opacity="0.06" />
          <ellipse cx="230" cy="112" rx="106" ry="16" fill="#000" opacity={light ? 0.22 : 0.45} />
        </g>
      )}

      {product.id === "sticker" && (
        <g transform="rotate(-6 250 250)" filter={`url(#${uid}-diecut)`}>
          {print}
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
        <g style={{ pointerEvents: "none" }}>
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
      </g>
      <g stroke={stroke}>{shape.details}</g>
    </g>
  );
}
