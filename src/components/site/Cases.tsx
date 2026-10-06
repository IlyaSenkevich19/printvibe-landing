import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { business } from "@/content/business";
import { cases, categories, type CategoryId } from "@/content/cases";
import { WorkPhoto } from "./WorkPhoto";
import { ArrowIcon, InstagramIcon, PlusIcon } from "./icons";

type Filter = CategoryId | "all";

export function Cases() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);

  const available = useMemo(
    () => categories.filter((c) => cases.some((item) => item.category === c.id)),
    [],
  );
  const visible = filter === "all" ? cases : cases.filter((c) => c.category === filter);

  return (
    <section id="works" aria-labelledby="works-title" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-violet">Работы</p>
            <h2 id="works-title" className="mt-3 font-display text-4xl leading-none md:text-6xl">
              Что мы уже напечатали
            </h2>
          </div>
          <p className="max-w-sm text-ink/70">
            Реальные заказы наших клиентов. Ещё больше — в Instagram{" "}
            <a
              href={business.instagram.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-violet underline-offset-4 hover:underline"
            >
              {business.instagram.handle}
            </a>
            .
          </p>
        </div>

        {cases.length > 0 && (
          <>
            {available.length > 1 && (
              <div
                role="group"
                aria-label="Фильтр по изделиям"
                className="mt-10 flex flex-wrap gap-2"
              >
                <Chip active={filter === "all"} onClick={() => setFilter("all")}>
                  Все · {cases.length}
                </Chip>
                {available.map((c) => (
                  <Chip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
                    {c.label}
                  </Chip>
                ))}
              </div>
            )}

            <ul className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4">
              {visible.map((item, i) => (
                <li key={item.src + i} className="reveal mb-4 break-inside-avoid">
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="group relative block w-full overflow-hidden border-2 border-ink bg-card text-left"
                    aria-label={`Открыть: ${item.caption}`}
                  >
                    <WorkPhoto
                      image={item}
                      alt={item.caption}
                      sizes="(min-width: 1024px) 240px, (min-width: 768px) 30vw, 45vw"
                      className="block w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-ink/85 px-3 py-2 text-sm font-medium text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {item.caption}
                      <PlusIcon className="size-4 shrink-0" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-12 grid gap-8 border-2 border-ink bg-card p-6 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="eyebrow text-ink/60">Больше работ</p>
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

      {open !== null && (
        <Lightbox items={visible} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`border-2 border-ink px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-ink text-paper" : "bg-card hover:bg-violet-soft"
      }`}
    >
      {children}
    </button>
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: typeof cases;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = items[index];
  const go = (delta: number) => onIndex((index + delta + items.length) % items.length);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  if (!item) return null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      aria-label={item.caption}
      className="m-auto max-h-[92vh] w-[min(92vw,60rem)] bg-transparent p-0 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
    >
      <figure className="border-2 border-ink bg-card">
        <WorkPhoto
          image={item}
          alt={item.caption}
          sizes="(max-width: 960px) 92vw, 960px"
          priority
          className="max-h-[75vh] w-full object-contain"
        />
        <figcaption className="flex items-center justify-between gap-4 border-t-2 border-ink px-4 py-3">
          <span className="font-semibold">{item.caption}</span>
          <span className="flex items-center gap-2">
            <span className="mr-2 font-mono text-sm text-ink/60">
              {index + 1} / {items.length}
            </span>
            {items.length > 1 && (
              <>
                <IconButton label="Предыдущая" onClick={() => go(-1)}>
                  <ArrowIcon className="size-4 rotate-180" />
                </IconButton>
                <IconButton label="Следующая" onClick={() => go(1)}>
                  <ArrowIcon className="size-4" />
                </IconButton>
              </>
            )}
            <IconButton label="Закрыть" onClick={() => ref.current?.close()}>
              <PlusIcon className="size-4 rotate-45" />
            </IconButton>
          </span>
        </figcaption>
      </figure>
    </dialog>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-10 place-items-center border-2 border-ink bg-card hover:bg-violet hover:text-white"
    >
      {children}
    </button>
  );
}
