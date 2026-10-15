import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { business, hours, mapLinks } from "@/content/business";
import { useOpenStatus } from "@/lib/open-status";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, TelegramIcon } from "./icons";
import { CropMarks } from "./print-marks";

export function Contacts() {
  const status = useOpenStatus();

  return (
    <section
      id="contacts"
      aria-labelledby="contacts-title"
      className="border-t-2 border-ink bg-paper-deep py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5">
        <p className="eyebrow text-violet">Контакты</p>
        <h2 id="contacts-title" className="mt-3 font-display text-4xl leading-none md:text-6xl">
          Приходите или пишите
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-10">
            <address className="not-italic">
              <p className="eyebrow text-ink/60">Адрес</p>
              <p className="mt-2 text-2xl font-bold md:text-3xl">
                {business.address.city}, {business.address.street}
              </p>
              <p className="mt-1 text-lg text-ink/75">{business.address.floor}</p>

              <ul className="mt-8 grid max-w-md gap-3">
                <li>
                  <ContactLink href={business.phone.href} icon={<PhoneIcon />} label="Телефон">
                    {business.phone.display}
                  </ContactLink>
                </li>
                <li>
                  <ContactLink
                    href={business.telegram.url}
                    icon={<TelegramIcon />}
                    label="Telegram"
                    external
                  >
                    {business.telegram.handle}
                  </ContactLink>
                </li>
                <li>
                  <ContactLink
                    href={business.instagram.url}
                    icon={<InstagramIcon />}
                    label="Instagram"
                    external
                  >
                    {business.instagram.handle}
                  </ContactLink>
                </li>
                <li>
                  <ContactLink href={business.email.href} icon={<MailIcon />} label="Почта">
                    <span className="break-all">{business.email.address}</span>
                  </ContactLink>
                </li>
              </ul>
            </address>

            <div>
              <p className="eyebrow text-ink/60">Режим работы</p>
              <table className="mt-3 w-full max-w-md text-left">
                <caption className="sr-only">Режим работы салона</caption>
                <tbody>
                  {hours.map((d, i) => {
                    const isToday = status?.today === i;
                    return (
                      <tr
                        key={d.label}
                        className={`border-b border-ink/15 ${isToday ? "bg-orange/30 font-bold" : ""}`}
                        aria-current={isToday ? "date" : undefined}
                      >
                        <th scope="row" className="py-2.5 pl-2 font-medium">
                          {d.label}
                          {isToday && <span className="eyebrow ml-2 text-ink/60">сегодня</span>}
                        </th>
                        <td className="py-2.5 pr-2 text-right font-mono text-sm">
                          {d.open ? `${d.open}–${d.close}` : "выходной"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <MapFacade />
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  href,
  icon,
  label,
  children,
  external,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener" })}
      className="group flex items-center gap-4 border-2 border-ink bg-card px-4 py-3.5 transition-colors duration-200 hover:border-violet hover:bg-violet-soft"
    >
      <span className="grid size-10 shrink-0 place-items-center bg-violet text-white">{icon}</span>
      <span>
        <span className="eyebrow block text-ink/60">{label}</span>
        <span className="mt-0.5 block text-lg font-semibold">{children}</span>
      </span>
    </a>
  );
}

function MapFacade() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="relative min-h-[22rem] flex-1 border-2 border-ink bg-card">
        {loaded ? (
          <iframe
            title={`Карта: ${business.name}, ${business.address.city}, ${business.address.street}`}
            src={mapLinks.embed}
            className="absolute inset-0 size-full border-0"
            allow="geolocation"
          />
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            <div
              aria-hidden
              className="halftone absolute inset-0 text-ink/15 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]"
            />
            <svg
              aria-hidden
              className="absolute inset-0 size-full text-ink/20"
              preserveAspectRatio="none"
              viewBox="0 0 400 300"
            >
              <path d="M-10 210 L410 120" stroke="currentColor" strokeWidth="14" />
              <path d="M120 -10 L180 310" stroke="currentColor" strokeWidth="9" />
              <path d="M300 -10 L260 310" stroke="currentColor" strokeWidth="6" />
              <path d="M-10 60 L410 90" stroke="currentColor" strokeWidth="5" />
            </svg>
            <div className="absolute inset-0 grid place-items-center p-6">
              <div className="flex flex-col items-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-violet text-white shadow-[0_0_0_10px_color-mix(in_oklch,var(--violet)_20%,transparent)]">
                  <PinIcon className="size-6" />
                </span>
                <p className="mt-4 bg-card px-2 font-bold">{business.address.street}</p>
                <button
                  type="button"
                  onClick={() => setLoaded(true)}
                  className="btn btn-ghost mt-5"
                >
                  Показать карту
                </button>
                <p className="mt-3 max-w-xs bg-card/80 px-2 text-xs text-ink/60">
                  Карта загружается с сервиса Яндекс Карты. Подробнее —{" "}
                  <Link to="/privacy" className="underline underline-offset-2">
                    в политике конфиденциальности
                  </Link>
                  .
                </p>
              </div>
            </div>
            <CropMarks className="m-5" />
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
        <a
          href={mapLinks.yandex}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-4 hover:text-violet"
        >
          Открыть в Яндекс Картах
        </a>
        <a
          href={mapLinks.google}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-4 hover:text-violet"
        >
          Маршрут в Google Maps
        </a>
      </div>
    </div>
  );
}
