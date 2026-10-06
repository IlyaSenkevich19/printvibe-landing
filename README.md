# PrintVibe

Лендинг салона печати PrintVibe в Гомеле: футболки, худи, кружки, наклейки и печать фото.

## Запуск

Нужен Node.js 22 (`nvm use`).

```sh
nvm use
yarn
yarn dev
```

Сайт открывается на http://localhost:8080/. Если команда `yarn` не находится, один раз выполните `corepack enable` — она есть в Node 22.

Проверки: `yarn tsc --noEmit -p .`, `yarn eslint src`, `yarn build`.

Пуш в `redesign` или `main` публикует превью на GitHub Pages, без своего домена: `https://matveypodolnitsky.github.io/printvibe-landing-page/`. В репозитории один раз включите Settings → Pages → Source: GitHub Actions.
