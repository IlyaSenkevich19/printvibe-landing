import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { setupOffline } from "@/lib/offline";
import appCss from "../styles.css?url";

const publicFile = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

function NotFoundComponent() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-8">
      <div className="w-full max-w-xl text-center">
        <div
          aria-hidden
          className="font-display text-[clamp(6rem,32vw,11rem)] leading-none [text-shadow:-0.035em_0.02em_0_var(--violet),0.03em_0.04em_0_var(--orange)]"
        >
          404
        </div>
        <h1 className="mt-6 font-display text-[clamp(1.5rem,6vw,2.25rem)] leading-[1.1]">
          Такой страницы нет
        </h1>
        <p className="mx-auto mt-3 max-w-md text-balance text-muted-foreground">
          Возможно, ссылка устарела или в адресе опечатка. Всё главное — на основной странице.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4 max-[30rem]:[&>a]:w-full">
          <Link to="/" className="btn btn-primary">
            На главную
          </Link>
          <Link to="/" hash="try" className="btn btn-ghost">
            Примерить свой макет
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Не удалось загрузить страницу
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Что-то пошло не так. Попробуйте обновить страницу или вернуться на главную.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-primary"
          >
            Попробовать снова
          </button>
          <a href={import.meta.env.BASE_URL} className="btn btn-ghost">
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f4f0e8" },
      { name: "format-detection", content: "telephone=no" },
      { title: "PrintVibe — салон печати в Гомеле" },
      { property: "og:site_name", content: "PrintVibe" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ru_BY" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "preload",
        href: publicFile("/fonts/dela-gothic-one-cyrillic.woff2"),
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: publicFile("/fonts/onest-cyrillic.woff2"),
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: publicFile("/favicon.png"), type: "image/png" },
      { rel: "apple-touch-icon", href: publicFile("/favicon.png") },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(setupOffline, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
