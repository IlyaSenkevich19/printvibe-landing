import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const base = import.meta.env.BASE_URL;

const nav = [
  { href: `${base}#services`, label: "Что печатаем" },
  { href: `${base}#try`, label: "Примерка" },
  { href: `${base}#works`, label: "Работы" },
  { href: `${base}#how`, label: "Как заказать" },
  { href: `${base}#contacts`, label: "Контакты" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Перейти к содержимому
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:h-18">
        <Link to="/" aria-label="PrintVibe — на главную" className="shrink-0">
          <Logo className="w-32 md:w-40" />
        </Link>

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-5 text-[0.95rem] font-medium xl:gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative whitespace-nowrap py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-violet after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
