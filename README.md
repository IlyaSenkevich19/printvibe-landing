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

Перед пушем локально запускается `yarn verify` (типы и линтер). На GitHub при пуше в `main` код только собирается и публикуется.

Превью без своего домена: `https://ilyasenkevich19.github.io/printvibe-landing/`.
