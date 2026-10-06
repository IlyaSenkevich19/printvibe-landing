import { useEffect, useRef, useState } from "react";
import { business, services } from "@/content/business";
import { ArrowIcon, InstagramIcon } from "./icons";

export function Services() {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const pos = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      const dx = target.current.x - pos.x;
      const dy = target.current.y - pos.y;
      pos.x += dx * 0.14;
      pos.y += dy * 0.14;
      const tilt = Math.max(-12, Math.min(12, dx * 0.08));
      preview.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const rect = list.getBoundingClientRect();
      target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onEnter = (e: PointerEvent) => {
      onMove(e);
      pos.x = target.current.x;
      pos.y = target.current.y;
    };
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  const activeImage = active !== null ? services[active]?.image : undefined;

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

        <div ref={listRef} onPointerLeave={() => setActive(null)} className="relative mt-14">
          <ol className="border-t-2 border-ink">
            {services.map((s, i) => (
              <li
                key={s.id}
                onPointerEnter={() => setActive(i)}
                className="group reveal relative grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-b border-ink/20 py-7 md:grid-cols-[5rem_1.1fr_1.4fr_auto] md:items-center md:gap-x-8 md:py-9"
              >
                <span className="font-mono text-sm text-ink/50 transition-colors group-hover:text-violet md:text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-3xl leading-none transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 md:text-5xl">
                  {s.title}
                </h3>
                <div className="col-span-2 md:col-span-1">
                  <p className="max-w-md text-ink/75">{s.text}</p>
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Подходит для">
                    {s.uses.map((u) => (
                      <li
                        key={u}
                        className="border border-ink/25 px-2 py-0.5 font-mono text-xs text-ink/70"
                      >
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    width={816}
                    height={816}
                    loading="lazy"
                    decoding="async"
                    className="col-span-2 aspect-[4/3] w-full object-cover md:hidden"
                  />
                )}
                <ArrowIcon className="hidden size-8 -rotate-45 text-ink/30 transition-all duration-500 group-hover:rotate-0 group-hover:text-violet md:block" />
              </li>
            ))}
          </ol>

          <div
            ref={previewRef}
            aria-hidden
            className={`pointer-events-none absolute top-0 left-0 z-10 hidden w-64 bg-card p-2 shadow-[0_30px_60px_-20px_rgb(30_20_50/0.5)] transition-[opacity,scale] duration-300 md:block ${
              activeImage ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            {services.map(
              (s) =>
                s.image && (
                  <img
                    key={s.id}
                    src={s.image}
                    alt=""
                    width={816}
                    height={816}
                    loading="lazy"
                    className={`aspect-square w-full object-cover ${activeImage === s.image ? "block" : "hidden"}`}
                  />
                ),
            )}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-2 border-ink bg-card p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="eyebrow text-ink/60">Готовые работы</p>
            <p className="mt-2 font-display text-2xl leading-tight md:text-4xl">
              Свежие заказы — <span className="text-violet">{business.instagram.handle}</span>
            </p>
            <p className="mt-3 max-w-lg text-ink/70">
              В Instagram показываем то, что напечатали для клиентов: принты на одежде, кружки,
              стикеры.
            </p>
          </div>
          <a
            href={business.instagram.url}
            target="_blank"
            rel="noopener"
            className="btn btn-orange"
          >
            <InstagramIcon />
            Смотреть в Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
