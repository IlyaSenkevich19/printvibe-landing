import { Link } from "@tanstack/react-router";
import { business, fullAddress } from "@/content/business";

export function Footer() {
  const year = new Date().getFullYear();
  const { legal } = business;

  return (
    <footer className="bg-ink pt-16 pb-28 text-paper/80 md:pb-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-4xl text-paper md:text-6xl">
              Print<span className="text-orange">Vibe</span>
            </p>
            <p className="mt-3 max-w-sm">
              Салон печати в Гомеле: одежда, кружки, наклейки и фото с вашим дизайном.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <a
                href={business.telegram.url}
                target="_blank"
                rel="noopener"
                className="hover:text-orange"
              >
                Telegram
              </a>
            </li>
            <li>
              <a
                href={business.instagram.url}
                target="_blank"
                rel="noopener"
                className="hover:text-orange"
              >
                Instagram
              </a>
            </li>
            <li>
              <a href={business.phone.href} className="hover:text-orange">
                {business.phone.display}
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-paper/15 pt-6 text-xs text-paper/60 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            {legal.name && (
              <p>
                {legal.name}
                {legal.unp && <>, УНП {legal.unp}</>}
              </p>
            )}
            <p>{fullAddress}</p>
            <p>
              © {year} {business.name}
            </p>
          </div>
          <Link to="/privacy" className="underline underline-offset-4 hover:text-orange">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
