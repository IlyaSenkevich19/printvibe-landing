import { useEffect, useState } from "react";
import { hours } from "@/content/business";

export type OpenStatus = { open: boolean; label: string; today: number };

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const toMinutes = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function minskNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Minsk",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: Math.max(0, weekdays.indexOf(get("weekday"))),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function getOpenStatus(): OpenStatus {
  const { day, minutes } = minskNow();

  for (let offset = 0; offset < 7; offset++) {
    const d = hours[(day + offset) % 7];
    if (!d?.open || !d.close) continue;
    const opens = toMinutes(d.open);
    const closes = toMinutes(d.close);
    if (offset === 0 && minutes >= opens && minutes < closes) {
      return { open: true, label: `Открыто до ${d.close}`, today: day };
    }
    if (offset === 0 && minutes >= opens) continue;
    const when = offset === 0 ? "сегодня" : offset === 1 ? "завтра" : d.short.toLowerCase();
    return { open: false, label: `Закрыто · откроемся ${when} в ${d.open}`, today: day };
  }
  return { open: false, label: "Закрыто", today: day };
}

// Resolved only after mount: the server's clock and timezone must not leak into the HTML.
export function useOpenStatus() {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    setStatus(getOpenStatus());
    const id = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(id);
  }, []);
  return status;
}
