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

export type PrintSide = "front" | "back";

export type Product = {
  id: ProductId;
  name: string;
  colors: Fabric[];
  area: Area;
  note: string;
  back?: { area: Area; note: string };
};

export function printArea(product: Product, side: PrintSide): Area {
  return side === "back" && product.back ? product.back.area : product.area;
}

export function printNote(product: Product, side: PrintSide): string {
  return side === "back" && product.back ? product.back.note : product.note;
}

export const products: Product[] = [
  {
    id: "tshirt",
    name: "Футболка",
    colors: fabrics,
    area: { x: 170, y: 128, w: 160, h: 200 },
    note: "Принт на груди",
    back: { area: { x: 140, y: 118, w: 220, h: 250 }, note: "Принт на спине" },
  },
  {
    id: "hoodie",
    name: "Худи",
    colors: fabrics,
    area: { x: 178, y: 150, w: 144, h: 150 },
    note: "Принт на груди, над карманом",
    back: { area: { x: 150, y: 125, w: 200, h: 230 }, note: "Принт на спине" },
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
