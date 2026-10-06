export function CropMarks({ className = "" }: { className?: string }) {
  const corner = "absolute size-6 border-ink/50";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${corner} -top-3 -left-3 border-t border-l`} />
      <span className={`${corner} -top-3 -right-3 border-t border-r`} />
      <span className={`${corner} -bottom-3 -left-3 border-b border-l`} />
      <span className={`${corner} -right-3 -bottom-3 border-r border-b`} />
    </div>
  );
}

const swatches = [
  { name: "C", color: "oklch(0.75 0.14 225)" },
  { name: "M", color: "oklch(0.62 0.25 350)" },
  { name: "Y", color: "oklch(0.92 0.18 100)" },
  { name: "K", color: "var(--ink)" },
  { name: "V", color: "var(--violet)" },
  { name: "O", color: "var(--orange)" },
];

export function ColorBar({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-3 ${className}`}>
      <div className="flex">
        {swatches.map((s) => (
          <span key={s.name} className="size-4 sm:size-5" style={{ background: s.color }} />
        ))}
      </div>
      <RegistrationMark className="size-5 text-ink/70" />
    </div>
  );
}

export function RegistrationMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 1v22M1 12h22" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Stamp({ className = "" }: { className?: string }) {
  const text = "САЛОН ПЕЧАТИ · ГОМЕЛЬ · PRINTVIBE · ";
  return (
    <div aria-hidden className={className}>
      <svg viewBox="0 0 200 200" className="spin-slow size-full">
        <defs>
          <path id="stamp-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="var(--orange)" />
        <text fill="var(--ink)" fontFamily="var(--font-mono)" fontSize="15.5" letterSpacing="2.4">
          <textPath href="#stamp-circle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-3xl text-ink">
        ✶
      </span>
    </div>
  );
}
