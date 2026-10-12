import { business, faq } from "@/content/business";
import { PlusIcon } from "./icons";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow text-violet">FAQ</p>
          <h2 id="faq-title" className="mt-3 font-display text-4xl leading-none md:text-6xl">
            Частые вопросы
          </h2>
          <p className="mt-6 max-w-sm text-ink/70">
            Не нашли ответ? Напишите нам в{" "}
            <a
              href={business.telegram.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-violet underline-offset-4 hover:underline"
            >
              Telegram
            </a>{" "}
            или{" "}
            <a
              href={business.phone.href}
              className="font-semibold text-violet underline-offset-4 hover:underline"
            >
              позвоните
            </a>
            .
          </p>
        </div>

        <div className="border-t-2 border-ink">
          {faq.map((item, i) => (
            <details key={item.q} className="faq group border-b border-ink/20" open={i === 0}>
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 text-lg font-semibold transition-colors hover:text-violet md:text-xl">
                {item.q}
                <PlusIcon className="faq-icon mt-1 size-5 shrink-0" />
              </summary>
              <p className="max-w-2xl pb-7 text-ink/75 md:text-lg">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
