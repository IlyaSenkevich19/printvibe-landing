import tshirt from "@/assets/work-tshirt.jpg";
import hoodie from "@/assets/work-hoodie.jpg";
import mug from "@/assets/work-mug.jpg";
import stickers from "@/assets/work-stickers.jpg";

// Must match the production domain: canonical URLs, sitemap.xml, robots.txt and llms.txt rely on it.
export const SITE_URL = "https://printvibe.by";

export const business = {
  name: "PrintVibe",
  title: "Салон печати PrintVibe",
  // Belarusian law requires the seller to be identifiable on the site: fill both before going live.
  legal: {
    name: "" as string,
    unp: "" as string,
  },
  phone: { display: "+375 25 783-86-28", href: "tel:+375257838628", e164: "+375257838628" },
  telegram: { handle: "@ilw_dtl", url: "https://t.me/ilw_dtl" },
  instagram: { handle: "@printvibe.by", url: "https://www.instagram.com/printvibe.by/" },
  address: {
    street: "ул. М. Г. Ефремова, 16",
    floor: "2 этаж",
    city: "Гомель",
    region: "Гомельская область",
    postalCode: "246035",
    country: "BY",
  },
  geo: { lat: 52.4616753, lng: 30.9665726 },
} as const;

export const fullAddress = `${business.address.city}, ${business.address.street}, ${business.address.floor}`;

export const mapLinks = {
  yandex: `https://yandex.by/maps/?pt=${business.geo.lng},${business.geo.lat}&z=17&l=map&text=${encodeURIComponent(`${business.address.city}, ${business.address.street}`)}`,
  google: `https://www.google.com/maps/dir/?api=1&destination=${business.geo.lat},${business.geo.lng}`,
  embed: `https://yandex.by/map-widget/v1/?ll=${business.geo.lng},${business.geo.lat}&z=17&pt=${business.geo.lng},${business.geo.lat},pm2vvm`,
};

export type Day = {
  label: string;
  short: string;
  schemaDay: string;
  open?: string;
  close?: string;
};

// Index 0 is Monday.
export const hours: Day[] = [
  { label: "Понедельник", short: "Пн", schemaDay: "Monday", open: "10:00", close: "18:00" },
  { label: "Вторник", short: "Вт", schemaDay: "Tuesday", open: "10:00", close: "18:00" },
  { label: "Среда", short: "Ср", schemaDay: "Wednesday", open: "10:00", close: "18:00" },
  { label: "Четверг", short: "Чт", schemaDay: "Thursday", open: "10:00", close: "18:00" },
  { label: "Пятница", short: "Пт", schemaDay: "Friday", open: "10:00", close: "18:00" },
  { label: "Суббота", short: "Сб", schemaDay: "Saturday", open: "10:00", close: "14:00" },
  { label: "Воскресенье", short: "Вс", schemaDay: "Sunday" },
];

export const hoursSummary = "Пн–Пт 10:00–18:00, Сб 10:00–14:00, Вс — выходной";

export type Service = {
  id: string;
  title: string;
  text: string;
  uses: string[];
  image?: string;
  imageAlt?: string;
};

export const services: Service[] = [
  {
    id: "tshirts",
    title: "Футболки",
    text: "Печать на футболках с вашим дизайном: логотип, надпись, фотография или собственный рисунок.",
    uses: ["подарок", "команда", "мерч", "мероприятие"],
    image: tshirt,
    imageAlt: "Чёрная футболка с цветным принтом на груди",
  },
  {
    id: "hoodies",
    title: "Худи и свитшоты",
    text: "Принт на груди, спине или рукаве — для себя, для команды или в качестве фирменной одежды.",
    uses: ["спина", "грудь", "рукав"],
    image: hoodie,
    imageAlt: "Серое худи с принтом на спине",
  },
  {
    id: "mugs",
    title: "Кружки",
    text: "Фото, надпись или поздравление на кружке. Подарок, который каждый день на столе.",
    uses: ["фото", "надпись", "поздравление"],
    image: mug,
    imageAlt: "Белая кружка с напечатанной семейной фотографией",
  },
  {
    id: "stickers",
    title: "Наклейки",
    text: "Стикеры по вашему макету — для ноутбука, упаковки, товаров или фирменного стиля.",
    uses: ["упаковка", "бренд", "стикерпак"],
    image: stickers,
    imageAlt: "Набор цветных наклеек разной формы",
  },
  {
    id: "photo",
    title: "Печать фото",
    text: "Печать фотографий с телефона или флешки — для альбома, рамки или подарка.",
    uses: ["альбом", "рамка", "подарок"],
  },
];

export const steps = [
  {
    title: "Напишите нам",
    text: `В Telegram ${business.telegram.handle}, по телефону или в Instagram. Пришлите идею, фото или готовый макет.`,
  },
  {
    title: "Согласуем детали",
    text: "Подберём изделие и размер, при необходимости поможем с макетом и назовём стоимость.",
  },
  {
    title: "Печатаем",
    text: "Переносим ваш дизайн на изделие.",
  },
  {
    title: "Забираете",
    text: `В салоне: ${business.address.street}, ${business.address.floor}.`,
  },
];

export const faq = [
  {
    q: "Что можно напечатать в PrintVibe?",
    a: "Футболки, худи и свитшоты, кружки, наклейки и фотографии — с вашим логотипом, надписью, фото или рисунком.",
  },
  {
    q: "Где находится салон печати?",
    a: `В Гомеле: ${business.address.street}, ${business.address.floor}.`,
  },
  {
    q: "Какой режим работы?",
    a: `${hoursSummary}.`,
  },
  {
    q: "Как сделать заказ?",
    a: `Напишите в Telegram ${business.telegram.handle}, позвоните по номеру ${business.phone.display} или напишите в Instagram ${business.instagram.handle}. Пришлите идею или готовый макет — согласуем детали и стоимость.`,
  },
  {
    q: "У меня нет готового макета. Что делать?",
    a: "Опишите идею или пришлите фото и примеры, которые нравятся, — поможем подготовить макет к печати.",
  },
  {
    q: "Сколько стоит печать?",
    a: "Стоимость зависит от изделия, размера принта и количества. Напишите нам, что хотите напечатать, и мы назовём цену для вашего заказа.",
  },
];
