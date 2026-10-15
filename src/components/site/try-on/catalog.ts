import type { ProductId } from "@/lib/try-on";

export type Fabric = { id: string; name: string; fill: string; light: boolean };

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

export type Area = { x: number; y: number; w: number; h: number };

/** Print position in mockup units (the SVG is 500×500). Height follows from the image proportions. */
export type Placement = { x: number; y: number; w: number };

export type PrintSide = "front" | "back";

export type Product = {
  id: ProductId;
  name: string;
  colors: Fabric[];
  /** Where the print starts. */
  area: Area;
  /** How far the print may grow: sleeve to sleeve on clothes, the whole wrap on a mug. */
  canvas: Area;
  note: string;
  back?: { area: Area; note: string };
};

export function printArea(product: Product, side: PrintSide): Area {
  return side === "back" && product.back ? product.back.area : product.area;
}

export function printNote(product: Product, side: PrintSide): string {
  return side === "back" && product.back ? product.back.note : product.note;
}

export const MIN_PRINT_WIDTH = 30;

export function defaultPlacement(product: Product, side: PrintSide, aspect: number): Placement {
  const area = printArea(product, side);
  const w = Math.min(area.w * 0.8, area.h * 0.8 * aspect);
  return { x: area.x + (area.w - w) / 2, y: area.y + area.h * 0.03, w };
}

export const products: Product[] = [
  {
    id: "tshirt",
    name: "Футболка",
    colors: fabrics,
    area: { x: 170, y: 128, w: 160, h: 200 },
    canvas: { x: 35, y: 45, w: 430, h: 423 },
    note: "Принт на груди",
    back: { area: { x: 140, y: 118, w: 220, h: 250 }, note: "Принт на спине" },
  },
  {
    id: "hoodie",
    name: "Худи",
    colors: fabrics,
    area: { x: 178, y: 150, w: 144, h: 150 },
    canvas: { x: 42, y: 48, w: 416, h: 418 },
    note: "Принт на груди, над карманом",
    back: { area: { x: 150, y: 125, w: 200, h: 230 }, note: "Принт на спине" },
  },
  {
    id: "mug",
    name: "Кружка",
    colors: mugColors,
    area: { x: 138, y: 150, w: 184, h: 210 },
    canvas: { x: 110, y: 110, w: 240, h: 302 },
    note: "Печать по кругу кружки",
  },
];
