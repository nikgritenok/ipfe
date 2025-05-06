# Frontend

Фронтенд часть образовательной платформы, разработанная с использованием Vue.js и TypeScript.

## Структура проекта

- `src/` - исходный код приложения
  - `components/` - Vue компоненты
  - `pages/` - страницы приложения
  - `hooks/` - пользовательские хуки
  - `services/` - сервисы для работы с API
  - `types/` - TypeScript типы
  - `utils/` - вспомогательные функции
- `public/` - статические файлы
- `.vscode/` - настройки VS Code
- `env.d.ts` - определения типов для переменных окружения

## Технологии

- Vue.js
- TypeScript
- Vite
- ESLint
- Prettier

## Запуск проекта

1. Установите зависимости:

```bash
yarn
```

2. Запустите проект в режиме разработки:

```bash
yarn dev
```

3. Сборка для продакшена:

```bash
yarn build
```

4. Проверка типов:

```bash
yarn type-check
```

5. Линтинг кода:

```bash
yarn lint
```

## Настройка IDE

Рекомендуется использовать [VSCode](https://code.visualstudio.com/) с установленным расширением [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) для лучшей поддержки Vue.js.

## Конфигурация

- `vite.config.ts` - конфигурация сборщика Vite
- `.env` - переменные окружения
- `tsconfig.json` - настройки TypeScript
- `.prettierrc.json` - настройки форматирования кода
- `.editorconfig` - настройки редактора
- `eslint.config.ts` - настройки линтера
