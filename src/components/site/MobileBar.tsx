import { business, mapLinks } from "@/content/business";
import { PhoneIcon, PinIcon, TelegramIcon } from "./icons";

export function MobileBar() {
  const item =
    "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs font-semibold";
  return (
    <nav
      aria-label="Быстрые действия"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t-2 border-ink bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a
        href={business.telegram.url}
        target="_blank"
        rel="noopener"
        className={`${item} bg-violet text-white`}
      >
        <TelegramIcon />
        Telegram
      </a>
      <a href={business.phone.href} className={`${item} border-x-2 border-ink`}>
        <PhoneIcon />
        Позвонить
      </a>
      <a href={mapLinks.yandex} target="_blank" rel="noopener" className={item}>
        <PinIcon />
        Маршрут
      </a>
    </nav>
  );
}
