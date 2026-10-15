import { services, type Service } from "@/content/business";
import { requestTryOn } from "@/lib/try-on";
import { WorkPhoto } from "./WorkPhoto";
import { ArrowIcon } from "./icons";

const layout: Record<string, string> = {
  tshirts: "lg:col-span-2 lg:row-span-2",
  hoodies: "",
  mugs: "",
  photo: "lg:col-span-2",
};

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-violet">Услуги</p>
            <h2 id="services-title" className="mt-3 font-display text-4xl leading-none md:text-6xl">
              Что печатаем
            </h2>
          </div>
          <p className="max-w-sm text-ink/70">
            Принесите идею, фото или готовый файл — перенесём его на вещь, которую будут носить и
            дарить.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
          {services.map((s, i) => (
            <li key={s.id} className={layout[s.id] ?? ""}>
              {s.image ? <ImageCard service={s} index={i} /> : <PhotoCard service={s} index={i} />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CardBody({
  service,
  index,
  grow = true,
}: {
  service: Service;
  index: number;
  grow?: boolean;
}) {
  return (
    <div className={`flex flex-col p-5 md:p-6 ${grow ? "flex-1" : "flex-1 lg:flex-none"}`}>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-ink/50">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="font-display text-2xl leading-none md:text-3xl">{service.title}</h3>
      </div>
      <p className="mt-3 text-ink/75">{service.text}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Подходит для">
        {service.uses.map((u) => (
          <li key={u} className="border border-ink/25 px-2 py-0.5 font-mono text-xs text-ink/70">
            {u}
          </li>
        ))}
      </ul>
      {service.tryOn && (
        <a
          href="#try"
          onClick={() => requestTryOn(service.tryOn!)}
          className="mt-auto inline-flex items-center gap-2 self-start pt-6 font-semibold text-violet underline-offset-4 hover:underline"
        >
          Примерить свой дизайн
          <ArrowIcon className="size-4" />
        </a>
      )}
    </div>
  );
}

const card =
  "group flex h-full flex-col overflow-hidden border-2 border-ink bg-card transition-colors duration-300 hover:border-violet focus-within:border-violet";

function HoverBar({ color = "bg-violet" }: { color?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-x-0 bottom-0 h-1.5 origin-left scale-x-0 ${color} transition-transform duration-500 ease-[var(--ease-out-expo)] group-focus-within:scale-x-100 group-hover:scale-x-100`}
    />
  );
}

function ImageCard({ service, index }: { service: Service; index: number }) {
  const big = service.id === "tshirts";
  return (
    <article className={card}>
      <div
        className={`relative overflow-hidden border-b-2 border-ink transition-colors duration-300 group-hover:border-violet ${big ? "lg:min-h-0 lg:flex-1" : ""}`}
      >
        {service.image && (
          <WorkPhoto
            image={service.image}
            alt={service.imageAlt ?? ""}
            sizes={
              big
                ? "(min-width: 1024px) 640px, (min-width: 640px) 50vw, 100vw"
                : "(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
            }
            className={`w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 ${
              big ? "aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full" : "aspect-[4/3]"
            }`}
          />
        )}
        <HoverBar />
      </div>
      <CardBody service={service} index={index} grow={!big} />
    </article>
  );
}

function PhotoCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className={card}>
      <div
        aria-hidden
        className="relative grid aspect-[4/3] place-items-center overflow-hidden border-b-2 border-ink bg-violet transition-colors duration-300 group-hover:border-violet lg:aspect-[8/3]"
      >
        <div className="halftone absolute inset-0 text-white/20" />
        {[-10, 4, -2].map((deg, i) => (
          <span
            key={deg}
            className="absolute aspect-[3/4] w-[38%] bg-white p-1.5 pb-6 shadow-lg transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 lg:w-[19%]"
            style={{ rotate: `${deg}deg`, translate: `${(i - 1) * 22}% ${i * 4}%` }}
          >
            <span
              className="block size-full"
              style={{
                background: [
                  "linear-gradient(160deg, oklch(0.8 0.1 230), oklch(0.55 0.12 260))",
                  "linear-gradient(160deg, oklch(0.85 0.12 80), oklch(0.65 0.18 40))",
                  "linear-gradient(160deg, oklch(0.8 0.12 150), oklch(0.5 0.1 170))",
                ][i],
              }}
            />
          </span>
        ))}
        <HoverBar color="bg-orange" />
      </div>
      <CardBody service={service} index={index} />
    </article>
  );
}
