# Информационный портал для образования (IPFE)

## О проекте

IPFE - это современное веб-приложение, разработанное для образовательных целей. Проект построен с использованием Vue.js для фронтенда и Node.js с Express для бэкенда.

## Технологический стек

### Frontend

- Vue.js
- TypeScript
- Vite
- Vue Router
- Pinia
- PrimeVue
- PrimeFlex
- PrimeIcons

### Backend

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT для аутентификации
- Multer для загрузки файлов
- Sharp для обработки изображений

## Структура проекта

```
ipfe/
├── frontend/          # Vue.js приложение
├── backend/           # Express сервер
└── package.json       # Корневой package.json с workspaces
```

## Установка и запуск

### Предварительные требования

- Node.js (версия 16 или выше)
- Yarn
- MongoDB

### Установка зависимостей

```bash
# Установка всех зависимостей (frontend и backend)
yarn install
```

### Запуск в режиме разработки

#### Frontend

```bash
cd frontend
yarn dev
```

#### Backend

```bash
cd backend
yarn dev
```

### Сборка для продакшена

```bash
# Frontend
cd frontend
yarn build

# Backend
cd backend
yarn build
```

## Тестирование

```bash
# Запуск тестов backend
cd backend
yarn test
```

## Линтинг

```bash
# Frontend
cd frontend
yarn lint

# Backend
cd backend
yarn lint
```

## Рекомендуемые настройки IDE

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) для Vue.js
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

