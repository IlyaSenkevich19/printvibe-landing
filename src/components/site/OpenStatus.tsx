import { useOpenStatus } from "@/lib/open-status";

export function OpenStatus({ className = "" }: { className?: string }) {
  const status = useOpenStatus();
  return (
    <span
      className={`inline-flex min-h-6 items-center gap-2 font-mono text-xs tracking-wide ${className}`}
      aria-live="polite"
    >
      {status && (
        <>
          <span
            aria-hidden
            className={`size-2 rounded-full ${status.open ? "blink bg-emerald-500" : "bg-current opacity-50"}`}
          />
          {status.label}
        </>
      )}
    </span>
  );
}
