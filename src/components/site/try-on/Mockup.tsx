import {
  useEffect,
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

function placeBox(area: Area, x: number, y: number, w: number, h: number): Area {
  return {
    x: area.x + area.w * x,
    y: area.y + area.h * y,
    w: area.w * w,
    h: area.h * h,
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const MIN_FRACTION = 0.2;

type Corner = "nw" | "ne" | "sw" | "se";

type Gesture =
  | { kind: "move"; id: number; sx: number; sy: number; x: number; y: number; w: number; h: number }
  | { kind: "resize"; id: number; corner: Corner; opposite: { x: number; y: number } };

function oppositeCorner(corner: Corner, box: Area) {
  if (corner === "nw") return { x: box.x + box.w, y: box.y + box.h };
  if (corner === "ne") return { x: box.x, y: box.y + box.h };
  if (corner === "sw") return { x: box.x + box.w, y: box.y };
  return { x: box.x, y: box.y };
}

function clientToUser(svg: SVGSVGElement, clientX: number, clientY: number, rotate: boolean) {
  const rect = svg.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  let x = ((clientX - rect.left) / rect.width) * 500;
  let y = ((clientY - rect.top) / rect.height) * 500;
  if (rotate) {
    const cos = Math.cos((-6 * Math.PI) / 180);
    const sin = Math.sin((-6 * Math.PI) / 180);
    const dx = x - 250;
    const dy = y - 250;
    x = 250 + dx * cos - dy * sin;
    y = 250 + dx * sin + dy * cos;
  }
  return { x, y };
}

function resizeBox(
  corner: Corner,
  opposite: { x: number; y: number },
  pointer: { x: number; y: number },
  area: Area,
) {
  const minW = area.w * MIN_FRACTION;
  const minH = area.h * MIN_FRACTION;
  const rightEdge = area.x + area.w;
  const bottomEdge = area.y + area.h;
  let left = area.x;
  let right = rightEdge;
  let top = area.y;
  let bottom = bottomEdge;

  if (corner === "se") {
    left = opposite.x;
    top = opposite.y;
    right = clamp(pointer.x, left + minW, rightEdge);
    bottom = clamp(pointer.y, top + minH, bottomEdge);
  } else if (corner === "nw") {
    right = opposite.x;
    bottom = opposite.y;
    left = clamp(pointer.x, area.x, right - minW);
    top = clamp(pointer.y, area.y, bottom - minH);
  } else if (corner === "ne") {
    left = opposite.x;
    bottom = opposite.y;
    right = clamp(pointer.x, left + minW, rightEdge);
    top = clamp(pointer.y, area.y, bottom - minH);
  } else {
    right = opposite.x;
    top = opposite.y;
    left = clamp(pointer.x, area.x, right - minW);
    bottom = clamp(pointer.y, top + minH, bottomEdge);
  }

  return {
    x: (left - area.x) / area.w,
    y: (top - area.y) / area.h,
    w: (right - left) / area.w,
    h: (bottom - top) / area.h,
  };
}

function Print({
  url,
  box,
  blend,
  canDrag,
  grabbing,
  onPointerDown,
}: {
  url: string | undefined;
  box: Area;
  blend: "multiply" | "normal";
  canDrag: boolean;
  grabbing: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGGElement>) => void;
}) {
  return (
    <g
      style={{
        cursor: canDrag ? (grabbing ? "grabbing" : "grab") : undefined,
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
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
  if (!url) {
    return (
      <g transform={`translate(${box.x} ${box.y}) scale(${box.w / 100} ${box.h / 100})`}>
        <SampleArt />
      </g>
    );
  }

  return (
    <image
      href={url}
      x={box.x}
      y={box.y}
      width={box.w}
      height={box.h}
      preserveAspectRatio="none"
      style={{ mixBlendMode: blend }}
    />
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
      body: "M176 68 C210 48 228 100 250 128 C272 100 290 48 324 68 L388 96 C430 140 452 220 458 310 L452 428 L408 436 L398 300 L382 214 L376 448 C300 466 200 466 124 448 L118 214 L102 300 L92 436 L48 428 L42 310 C48 220 70 140 112 96 Z",
      hood: "M158 78 C190 8 310 8 342 78 C318 132 250 140 C182 132 158 78 Z",
      details: (
        <>
          <path d="M158 78 C190 8 310 8 342 78" fill="none" strokeWidth="2.5" opacity="0.4" />
          <path
            d="M176 68 C210 48 228 100 250 128 C272 100 290 48 324 68"
            fill="none"
            strokeWidth="12"
          />
          <path
            d="M226 112 L218 188 M274 112 L282 188"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M168 328 C210 318 290 318 332 328 L350 418 L150 418 Z"
            fill="none"
            strokeWidth="2.5"
            opacity="0.55"
          />
          <path d="M250 328 L250 416" fill="none" strokeWidth="1.5" opacity="0.35" />
          <path d="M124 436 C190 452 310 452 376 436" fill="none" strokeWidth="10" opacity="0.28" />
          <path d="M130 446 C200 458 300 458 370 446" fill="none" strokeWidth="4" opacity="0.22" />
          <path d="M52 412 L90 422 M56 424 L94 434" fill="none" strokeWidth="3" opacity="0.35" />
          <path
            d="M410 422 L448 412 M406 434 L444 424"
            fill="none"
            strokeWidth="3"
            opacity="0.35"
          />
        </>
      ),
      folds: "M145 250 Q175 320 155 410 M355 245 Q325 320 348 410 M118 150 Q148 190 128 230",
    },
    back: {
      body: "M188 82 C214 70 232 96 250 104 C268 96 286 70 312 82 L388 104 C430 148 452 220 458 310 L452 428 L408 436 L398 300 L382 214 L376 448 C300 466 200 466 124 448 L118 214 L102 300 L92 436 L48 428 L42 310 C48 220 70 148 112 104 Z",
      hood: "M162 92 C198 18 302 18 338 92 C314 52 250 46 C186 52 162 92 Z",
      details: (
        <>
          <path d="M162 92 C198 18 302 18 338 92" fill="none" strokeWidth="2.5" opacity="0.4" />
          <path
            d="M188 82 C214 70 232 96 250 104 C268 96 286 70 312 82"
            fill="none"
            strokeWidth="9"
          />
          <path d="M124 436 C190 452 310 452 376 436" fill="none" strokeWidth="10" opacity="0.28" />
          <path d="M130 446 C200 458 300 458 370 446" fill="none" strokeWidth="4" opacity="0.22" />
          <path d="M52 412 L90 422 M56 424 L94 434" fill="none" strokeWidth="3" opacity="0.35" />
          <path
            d="M410 422 L448 412 M406 434 L444 424"
            fill="none"
            strokeWidth="3"
            opacity="0.35"
          />
        </>
      ),
      folds: "M160 230 Q195 310 170 420 M340 220 Q310 310 335 420 M250 150 Q255 280 245 430",
    },
  },
};

export function Mockup({
  svgRef,
  product,
  side,
  color,
  design,
  x,
  y,
  w,
  h,
  onPlace,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  product: Product;
  side: PrintSide;
  color: Fabric | undefined;
  design: string | undefined;
  x: number;
  y: number;
  w: number;
  h: number;
  onPlace: (x: number, y: number, w: number, h: number) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const area = printArea(product, side);
  const box = placeBox(area, x, y, w, h);
  const fill = color?.fill ?? "#fff";
  const light = color?.light ?? true;
  const blend = product.id === "mug" && light ? "multiply" : "normal";
  const stroke = light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.14)";
  const rotate = product.id === "sticker";
  const canDrag = Boolean(design) && (w < 0.999 || h < 0.999);
  const gesture = useRef<Gesture | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const placeRef = useRef(onPlace);
  const areaRef = useRef(area);
  const applyRef = useRef<(event: { clientX: number; clientY: number }) => void>(() => {});
  placeRef.current = onPlace;
  areaRef.current = area;

  const applyGesture = (event: { clientX: number; clientY: number }) => {
    const current = gesture.current;
    const svg = svgRef.current;
    if (!current || !svg) return;
    const pointer = clientToUser(svg, event.clientX, event.clientY, rotate);
    if (!pointer) return;
    const printAreaNow = areaRef.current;
    if (current.kind === "move") {
      placeRef.current(
        clamp(current.x + (pointer.x - current.sx) / printAreaNow.w, 0, 1 - current.w),
        clamp(current.y + (pointer.y - current.sy) / printAreaNow.h, 0, 1 - current.h),
        current.w,
        current.h,
      );
      return;
    }
    const next = resizeBox(current.corner, current.opposite, pointer, printAreaNow);
    placeRef.current(next.x, next.y, next.w, next.h);
  };
  applyRef.current = applyGesture;

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!gesture.current || event.pointerId !== gesture.current.id) return;
      applyRef.current(event);
    };
    const up = (event: PointerEvent) => {
      if (!gesture.current || event.pointerId !== gesture.current.id) return;
      gesture.current = null;
      setGrabbing(false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  const capture = (event: ReactPointerEvent<SVGGElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    try {
      svg.setPointerCapture(event.pointerId);
    } catch {
      // The window listener still follows the pointer if capture is rejected.
    }
  };

  const onPointerDown = (event: ReactPointerEvent<SVGGElement>) => {
    if (!canDrag) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pointer = clientToUser(svg, event.clientX, event.clientY, rotate);
    if (!pointer) return;
    capture(event);
    gesture.current = {
      kind: "move",
      id: event.pointerId,
      sx: pointer.x,
      sy: pointer.y,
      x,
      y,
      w,
      h,
    };
    setGrabbing(true);
  };

  const onResizeDown = (corner: Corner, event: ReactPointerEvent<SVGGElement>) => {
    capture(event);
    gesture.current = {
      kind: "resize",
      id: event.pointerId,
      corner,
      opposite: oppositeCorner(corner, box),
    };
  };

  const print = (
    <Print
      url={design}
      box={box}
      blend={blend}
      canDrag={canDrag}
      grabbing={grabbing}
      onPointerDown={onPointerDown}
    />
  );

  const label =
    product.id === "sticker"
      ? "Превью наклейки с вашим дизайном. Принт можно перетащить и изменить размер за углы."
      : `Превью: ${product.name.toLowerCase()}, ${printNote(product, side).toLowerCase()}, цвет ${color?.name.toLowerCase()}. Принт можно перетащить и изменить размер за углы.`;

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

      {design && (
        <Selection box={box} rotate={product.id === "sticker"} onResizeDown={onResizeDown} />
      )}
    </svg>
  );
}

function Selection({
  box,
  rotate,
  onResizeDown,
}: {
  box: Area;
  rotate: boolean;
  onResizeDown: (corner: Corner, event: ReactPointerEvent<SVGGElement>) => void;
}) {
  const corners = [
    ["nw", box.x, box.y, "nwse-resize"],
    ["ne", box.x + box.w, box.y, "nesw-resize"],
    ["sw", box.x, box.y + box.h, "nesw-resize"],
    ["se", box.x + box.w, box.y + box.h, "nwse-resize"],
  ] as const;

  return (
    <g data-export="hide" transform={rotate ? "rotate(-6 250 250)" : undefined}>
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        fill="none"
        stroke="var(--ink)"
        strokeWidth={1.5}
        strokeDasharray="6 4"
        pointerEvents="none"
      />
      {corners.map(([corner, x, y, cursor]) => (
        <g
          key={corner}
          data-handle={corner}
          transform={`translate(${x} ${y})`}
          style={{ cursor, touchAction: "none" }}
          onPointerDown={(event) => onResizeDown(corner, event)}
        >
          <rect x={-22} y={-22} width={44} height={44} fill="transparent" />
          <rect
            x={-8}
            y={-8}
            width={16}
            height={16}
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={2}
          />
        </g>
      ))}
    </g>
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
        {design}
      </g>
      <g stroke={stroke}>{shape.details}</g>
    </g>
  );
}
