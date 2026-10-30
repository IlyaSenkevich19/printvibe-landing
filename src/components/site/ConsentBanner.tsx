import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getAnalyticsConsent, initYandexMetrika, setAnalyticsConsent } from "@/lib/analytics";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getAnalyticsConsent();
    if (consent === "accepted") {
      initYandexMetrika();
      return;
    }
    if (consent === null) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Согласие на аналитику"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-card p-4 shadow-[0_-8px_24px_oklch(0.19_0.03_295/12%)] md:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <p className="max-w-2xl text-sm text-ink/80 md:text-base">
          Мы используем Яндекс Метрику, чтобы понимать, как сайтом пользуются, и улучшать его.
          Продолжая, вы соглашаетесь на cookie аналитики. Подробнее — в{" "}
          <Link to="/privacy" className="font-semibold text-violet underline underline-offset-2">
            политике конфиденциальности
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-ghost btn-compact"
            onClick={() => {
              setAnalyticsConsent(false);
              setVisible(false);
            }}
          >
            Только необходимые
          </button>
          <button
            type="button"
            className="btn btn-primary btn-compact"
            onClick={() => {
              setAnalyticsConsent(true);
              setVisible(false);
            }}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
