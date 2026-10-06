import tshirt from "@/assets/work-tshirt.jpg";
import hoodie from "@/assets/work-hoodie.jpg";
import mug from "@/assets/work-mug.jpg";
import stickers from "@/assets/work-stickers.jpg";

export const categories = [
  { id: "tshirt", label: "Футболки" },
  { id: "hoodie", label: "Худи и свитшоты" },
  { id: "mug", label: "Кружки" },
  { id: "sticker", label: "Наклейки" },
  { id: "photo", label: "Фото" },
  { id: "other", label: "Другое" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type Case = {
  src: string;
  category: CategoryId;
  caption: string;
  demo?: boolean;
};

// Optional captions keyed by file name, e.g. "tshirt-team-2025.jpg": "Футболки для команды".
const captions: Record<string, string> = {};

const defaultCaption: Record<CategoryId, string> = {
  tshirt: "Печать на футболке",
  hoodie: "Печать на худи",
  mug: "Печать на кружке",
  sticker: "Наклейки",
  photo: "Печать фото",
  other: "Работа PrintVibe",
};

// File name prefix sets the category: tshirt-*, hoodie-*, mug-*, sticker-*, photo-*.
const files = import.meta.glob<string>("/src/assets/cases/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

const realCases: Case[] = Object.entries(files)
  .sort(([a], [b]) => b.localeCompare(a))
  .map(([path, src]) => {
    const file = path.split("/").pop() ?? "";
    const prefix = file.split(/[-_.]/)[0] as CategoryId;
    const category = categories.some((c) => c.id === prefix) ? prefix : "other";
    return { src, category, caption: captions[file] ?? defaultCaption[category] };
  });

const demoCases: Case[] = [
  { src: tshirt, category: "tshirt", caption: "Демо: футболка", demo: true },
  { src: mug, category: "mug", caption: "Демо: кружка", demo: true },
  { src: stickers, category: "sticker", caption: "Демо: наклейки", demo: true },
  { src: hoodie, category: "hoodie", caption: "Демо: худи", demo: true },
];

// Demo pictures are illustrations, not real orders: they must never ship to production.
export const cases: Case[] =
  realCases.length > 0 ? realCases : import.meta.env.DEV ? demoCases : [];
