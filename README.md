# PrintVibe

Лендинг салона печати PrintVibe в Гомеле: футболки, худи, кружки, наклейки и печать фото.

## Запуск

Нужен Node.js 22 (`nvm use`).

```sh
npm install
npm run dev
```

Сайт открывается на http://localhost:8080/.

Проверки: `npx tsc --noEmit -p .`, `npx eslint src`, `npm run build`.

Пуш в `redesign` или `main` публикует превью на GitHub Pages, без своего домена: `https://matveypodolnitsky.github.io/printvibe-landing-page/`. В репозитории один раз включите Settings → Pages → Source: GitHub Actions.
