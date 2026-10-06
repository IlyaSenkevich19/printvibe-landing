export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Не удалось загрузить страницу — PrintVibe</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #f4f0e8; color: #1a1a1a; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b463c; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0; font: inherit; cursor: pointer; text-decoration: none; border: 2px solid #1a1a1a; }
      .primary { background: #1a1a1a; color: #f4f0e8; }
      .secondary { background: transparent; color: #1a1a1a; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Не удалось загрузить страницу</h1>
      <p>Что-то пошло не так. Попробуйте обновить страницу или вернуться на главную.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Попробовать снова</button>
        <a class="secondary" href="/">На главную</a>
      </div>
    </div>
  </body>
</html>`;
}
