import { useId, type ReactNode, type RefObject } from "react";
import type { Area, Fabric, Product } from "./catalog";

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

export function Mockup({
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
