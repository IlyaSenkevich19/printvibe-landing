const items = ["Футболки", "Худи", "Свитшоты", "Кружки", "Наклейки", "Фото", "Ваш дизайн"];

export function Marquee() {
  const row = (
    <ul className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-8 pr-8 font-display text-2xl md:text-4xl">
          {item}
          <span className="text-orange">✶</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div
      aria-hidden
      className="marquee-wrap relative -my-px overflow-hidden border-y-2 border-ink bg-ink py-5 text-paper"
    >
      <div className="marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
