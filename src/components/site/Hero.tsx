import type { CSSProperties } from "react";
import { workImages } from "@/assets/work";
import { business, hoursSummary } from "@/content/business";
import { OpenStatus } from "./OpenStatus";
import { WorkPhoto } from "./WorkPhoto";
import { ArrowIcon, TelegramIcon } from "./icons";
import { ColorBar, CropMarks, Stamp } from "./print-marks";

const lines = ["Качественная", "печать", "с вашим"];

function RegLine({ text, i }: { text: string; i: number }) {
  return (
    <span className="reg-line" style={{ "--i": i } as CSSProperties}>
      <span className="reg-c">{text}</span>
      <span className="reg-m">{text}</span>
      <span className="reg-k">{text}</span>
    </span>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="paper-grain relative overflow-hidden border-b border-ink/10"
    >
      <div
        aria-hidden
        className="halftone pointer-events-none absolute -top-24 -right-24 size-[38rem] text-violet/25 [mask-image:radial-gradient(closest-side,black,transparent)]"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pt-12 pb-20 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10 lg:pb-28">
        <div>
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-ink/70">
            <span className="bg-ink px-2 py-1 text-paper">Салон печати</span>
            <span>
              {business.address.city} · {business.address.street}
            </span>
          </p>

          <h1
            id="hero-title"
            className="mt-7 font-display text-[clamp(2.1rem,10vw,5.9rem)] leading-[0.98] tracking-[-0.01em] lg:text-[clamp(3.5rem,6.2vw,5.9rem)]"
          >
            <span className="sr-only">Качественная печать с вашим дизайном</span>
            <span aria-hidden>
              {lines.map((line, i) => (
                <RegLine key={line} text={line} i={i} />
              ))}
              <span className="plate plate-in mt-2 inline-block bg-violet pt-[0.06em] pr-[0.55em] pb-[0.1em] pl-[0.12em] text-white">
                дизайном
              </span>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
            Футболки, худи, кружки, наклейки и фото с вашим логотипом, надписью или фотографией. Нет
            макета — поможем его сделать.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={business.telegram.url}
              target="_blank"
              rel="noopener"
              className="btn btn-primary"
            >
              <TelegramIcon />
              Написать в Telegram
            </a>
            <a href="#services" className="btn btn-ghost">
              Что печатаем
              <ArrowIcon className="size-4" />
            </a>
          </div>

          <dl className="mt-12 grid max-w-xl grid-cols-1 gap-x-8 gap-y-4 border-t border-ink/15 pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-ink/60">Режим работы</dt>
              <dd className="mt-1 font-medium">{hoursSummary}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink/60">Сейчас</dt>
              <dd className="mt-1">
                <OpenStatus className="text-sm text-ink" />
              </dd>
            </div>
          </dl>
        </div>

        <HeroSheets />
      </div>
    </section>
  );
}

function HeroSheets() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative aspect-[4/5] w-full">
        <figure
          className="print-in absolute top-0 left-[6%] w-[64%] rotate-[-4deg] bg-card p-2.5 pb-9 shadow-[0_30px_60px_-30px_rgb(30_20_50/0.45)]"
          style={{ "--d": "250ms" } as CSSProperties}
        >
          <WorkPhoto
            image={workImages.tshirt}
            alt=""
            sizes="(min-width: 1024px) 360px, 64vw"
            priority
            className="aspect-square w-full object-cover"
          />
          <figcaption className="eyebrow absolute bottom-2.5 left-3 text-[0.65rem] text-ink/60">
            01 · футболка
          </figcaption>
        </figure>

        <figure
          className="print-in absolute top-[30%] right-0 w-[52%] rotate-[5deg] bg-card p-2.5 pb-9 shadow-[0_30px_60px_-30px_rgb(30_20_50/0.45)]"
          style={{ "--d": "650ms" } as CSSProperties}
        >
          <WorkPhoto
            image={workImages.mug}
            alt=""
            sizes="(min-width: 1024px) 300px, 52vw"
            loading="eager"
            className="aspect-square w-full object-cover"
          />
          <figcaption className="eyebrow absolute bottom-2.5 left-3 text-[0.65rem] text-ink/60">
            03 · кружка
          </figcaption>
        </figure>

        <figure
          className="print-in absolute bottom-0 left-0 w-[44%] rotate-[-9deg] rounded-[1.4rem] bg-white p-2 shadow-[0_20px_40px_-20px_rgb(30_20_50/0.5)]"
          style={{ "--d": "1000ms" } as CSSProperties}
        >
          <WorkPhoto
            image={workImages.stickers}
            alt=""
            sizes="(min-width: 1024px) 240px, 44vw"
            loading="eager"
            className="aspect-square w-full rounded-[1rem] object-cover"
          />
        </figure>

        <Stamp className="absolute right-[4%] -bottom-4 size-28 md:size-32" />
        <CropMarks className="m-2" />
      </div>
      <ColorBar className="mt-10 justify-end" />
    </div>
  );
}
