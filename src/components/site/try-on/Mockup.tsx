import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  MIN_PRINT_WIDTH,
  printNote,
  type Area,
  type Fabric,
  type Placement,
  type PrintSide,
  type Product,
} from "./catalog";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type Corner = "nw" | "ne" | "sw" | "se";

type Gesture =
  | { kind: "move"; id: number; sx: number; sy: number; start: Placement }
  | { kind: "resize"; id: number; corner: Corner; opposite: { x: number; y: number } };

function toBox(placement: Placement, aspect: number): Area {
  return { x: placement.x, y: placement.y, w: placement.w, h: placement.w / aspect };
}

/** Largest width that fits the canvas: the print can reach from sleeve to sleeve, never past. */
function maxWidth(canvas: Area, aspect: number) {
  return Math.min(canvas.w, canvas.h * aspect);
}

/** Keeps the whole print inside the canvas. */
function fitPlacement(placement: Placement, canvas: Area, aspect: number): Placement {
  const w = clamp(
    placement.w,
    Math.min(MIN_PRINT_WIDTH, maxWidth(canvas, aspect)),
    maxWidth(canvas, aspect),
  );
  const h = w / aspect;
  return {
    x: clamp(placement.x, canvas.x, canvas.x + canvas.w - w),
    y: clamp(placement.y, canvas.y, canvas.y + canvas.h - h),
    w,
  };
}

function oppositeCorner(corner: Corner, box: Area) {
  if (corner === "nw") return { x: box.x + box.w, y: box.y + box.h };
  if (corner === "ne") return { x: box.x, y: box.y + box.h };
  if (corner === "sw") return { x: box.x + box.w, y: box.y };
  return { x: box.x, y: box.y };
}

function clientToUser(svg: SVGSVGElement, clientX: number, clientY: number) {
  const rect = svg.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return {
    x: ((clientX - rect.left) / rect.width) * 500,
    y: ((clientY - rect.top) / rect.height) * 500,
  };
}

/** Uniform resize: the opposite corner stays put and the proportions never change. */
function resizeFromCorner(
  corner: Corner,
  opposite: { x: number; y: number },
  pointer: { x: number; y: number },
  canvas: Area,
  aspect: number,
): Placement {
  const right = corner === "ne" || corner === "se";
  const down = corner === "sw" || corner === "se";
  const dx = right ? pointer.x - opposite.x : opposite.x - pointer.x;
  const dy = down ? pointer.y - opposite.y : opposite.y - pointer.y;
  const roomX = right ? canvas.x + canvas.w - opposite.x : opposite.x - canvas.x;
  const roomY = down ? canvas.y + canvas.h - opposite.y : opposite.y - canvas.y;
  const limit = Math.min(roomX, roomY * aspect);
  const w = clamp(Math.max(dx, dy * aspect), Math.min(MIN_PRINT_WIDTH, limit), limit);
  const h = w / aspect;
  return { x: right ? opposite.x : opposite.x - w, y: down ? opposite.y : opposite.y - h, w };
}

function Print({
  url,
  box,
  blend,
  canDrag,
  grabbing,
  label,
  onPointerDown,
  onKeyDown,
}: {
  url: string | undefined;
  box: Area;
  blend: "multiply" | "normal";
  canDrag: boolean;
  grabbing: boolean;
  label: string;
  onPointerDown: (event: ReactPointerEvent<SVGGElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<SVGGElement>) => void;
}) {
  return (
    <g
      {...(canDrag && { tabIndex: 0, role: "button", "aria-label": label })}
      className="outline-none focus-visible:[&>rect]:stroke-violet"
      style={{
        cursor: canDrag ? (grabbing ? "grabbing" : "grab") : undefined,
        touchAction: canDrag ? "none" : undefined,
      }}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <DesignLayer url={url} box={box} blend={blend} />
      {canDrag && (
        <rect
          x={box.x}
          y={box.y}
          width={box.w}
          height={box.h}
          fill="transparent"
          strokeWidth={3}
          data-export="hide"
        />
      )}
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
      preserveAspectRatio="xMidYMid meet"
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
  aspect,
  placement,
  onPlace,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  product: Product;
  side: PrintSide;
  color: Fabric | undefined;
  design: string | undefined;
  aspect: number;
  placement: Placement;
  onPlace: (placement: Placement) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const box = toBox(placement, aspect);
  const fill = color?.fill ?? "#fff";
  const light = color?.light ?? true;
  const blend = product.id === "mug" && light ? "multiply" : "normal";
  const stroke = light ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.14)";
  const canDrag = Boolean(design);
  const gesture = useRef<Gesture | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const latest = useRef({ onPlace, canvas: product.canvas, aspect });
  latest.current = { onPlace, canvas: product.canvas, aspect };

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const current = gesture.current;
      const svg = svgRef.current;
      if (!current || event.pointerId !== current.id || !svg) return;
      const pointer = clientToUser(svg, event.clientX, event.clientY);
      if (!pointer) return;
      const { onPlace: place, canvas, aspect: ratio } = latest.current;
      if (current.kind === "move") {
        const next = {
          x: current.start.x + pointer.x - current.sx,
          y: current.start.y + pointer.y - current.sy,
          w: current.start.w,
        };
        place(fitPlacement(next, canvas, ratio));
        return;
      }
      place(resizeFromCorner(current.corner, current.opposite, pointer, canvas, ratio));
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
  }, [svgRef]);

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
    const pointer = clientToUser(svg, event.clientX, event.clientY);
    if (!pointer) return;
    capture(event);
    gesture.current = {
      kind: "move",
      id: event.pointerId,
      sx: pointer.x,
      sy: pointer.y,
      start: placement,
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

  const onKeyDown = (event: ReactKeyboardEvent<SVGGElement>) => {
    const step = event.shiftKey ? 20 : 5;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const shift = moves[event.key];
    let next: Placement | null = null;
    if (shift) {
      next = { ...placement, x: placement.x + shift[0], y: placement.y + shift[1] };
    } else if (event.key === "+" || event.key === "=" || event.key === "-") {
      const w = placement.w + (event.key === "-" ? -step : step);
      next = {
        x: placement.x + (placement.w - w) / 2,
        y: placement.y + (placement.w - w) / aspect / 2,
        w,
      };
    }
    if (!next) return;
    event.preventDefault();
    onPlace(fitPlacement(next, product.canvas, aspect));
  };

  const where = `${product.name.toLowerCase()}, ${printNote(product, side).toLowerCase()}, цвет ${color?.name.toLowerCase()}`;
  const print = (
    <Print
      url={design}
      box={box}
      blend={blend}
      canDrag={canDrag}
      grabbing={grabbing}
      label="Ваш принт. Стрелки двигают, плюс и минус меняют размер."
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    />
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 500"
      role="group"
      aria-label={`Превью: ${where}. Принт можно перетащить и изменить размер за углы.`}
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

      {design && <Selection box={box} onResizeDown={onResizeDown} />}
    </svg>
  );
}

function Selection({
  box,
  onResizeDown,
}: {
  box: Area;
  onResizeDown: (corner: Corner, event: ReactPointerEvent<SVGGElement>) => void;
}) {
  const corners = [
    ["nw", box.x, box.y, "nwse-resize"],
    ["ne", box.x + box.w, box.y, "nesw-resize"],
    ["sw", box.x, box.y + box.h, "nesw-resize"],
    ["se", box.x + box.w, box.y + box.h, "nwse-resize"],
  ] as const;

  return (
    <g data-export="hide">
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
