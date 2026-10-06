import { business, steps } from "@/content/business";
import { TelegramIcon } from "./icons";

export function Process() {
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="relative overflow-hidden bg-violet py-24 text-white md:py-32"
    >
      <div
        aria-hidden
        className="halftone pointer-events-none absolute inset-y-0 right-0 w-1/2 text-white/15 [mask-image:linear-gradient(to_left,black,transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-5">
        <p className="eyebrow text-white/70">Как заказать</p>
        <h2
          id="how-title"
          className="mt-3 max-w-3xl font-display text-4xl leading-none md:text-6xl"
        >
          От идеи до готовой вещи — четыре шага
        </h2>

        <ol className="mt-16 grid gap-px bg-white/25 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="reveal flex flex-col bg-violet p-7 pt-8 md:min-h-72">
              <span className="font-display text-6xl text-orange md:text-7xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="reveal-line mt-6 block h-0.5 w-full bg-white/40" />
              <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-white/80">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14">
          <a href={business.telegram.url} target="_blank" rel="noopener" className="btn btn-orange">
            <TelegramIcon />
            Начать с шага 01
          </a>
        </div>
      </div>
    </section>
  );
}
