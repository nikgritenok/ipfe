# IPFE Project

## Обзор

Данный проект - это веб-приложение, которое включает в себя backend, написанный на TypeScript и Express, и frontend, разработанный с использованием Vue.js и Vite. Проект структурирован в два основных каталога: `backend` и `frontend`.

## Prerequisites

- Node.js версии 16 или выше
- Yarn (optional, но рекомендуется для управления пакетами)

## Установка и запуск

1. Клонировать репозиторий:

   ```bash
   git clone <repository-url>
   cd ipfe
   ```

2. Установить зависимости для backend:

   ```bash
   cd backend
   yarn install
   ```

3. Установите зависимости для frontend:
   ```bash
   cd frontend
   yarn install
   ```

## Переменные окружения

- Создайте файл `.env` в директории `backend` и установите следующие переменные:

  ```bash
  MONGODB_URI=mongodb://localhost:27017
  JWT_SECRET=your-secret-key
  ```

- Создайте файл `.env` в директории `backend` и установите следующие переменные:
  ```bash
  MONGODB_URI=mongodb://localhost:27017
  JWT_SECRET=your-secret-key
  ```

## Тестирование

1. Run the tests:
   ```bash
   cd backend
   yarn run test
   ```
