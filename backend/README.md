# Backend

## Технологии
- Node.js
- Express.js
- MongoDB.

## Запуск проекта

1. Установите зависимости:

```bash
npm install
```

2. Запустите сервер:

```bash
npm run dev
```

# Cтруктура backend

## Микросервисы

- `user-service` — сервис пользователей (регистрация, авторизация, профиль)
- `courses-service` — сервис курсов (курсы, уроки, комментарии, избранное, записи)
- `api-gateway` — единая точка входа для клиентов

## Инфраструктура

- MongoDB — база данных
- RabbitMQ — очередь сообщений для асинхронной обработки

## Шаги миграции
1. Вынести код в отдельные сервисы
2. Настроить RabbitMQ
3. Реализовать API Gateway

# Микросервисная архитектура: UserService, CourseService, API Gateway, RabbitMQ

## Описание

Проект состоит из трёх микросервисов:
- **user-service** — сервис пользователей (регистрация, авторизация, профиль)
- **courses-service** — сервис курсов (курсы, уроки, комментарии, избранное, записи)
- **api-gateway** — единая точка входа для клиентов

Для асинхронной обработки используется RabbitMQ:
- Очередь `users` — для событий user-service (например, регистрация пользователя)
- Очередь `enrollments` — для событий courses-service (например, запись на курс)

MongoDB используется как основная база данных.

---

## Запуск инфраструктуры

1. **Запустите MongoDB и RabbitMQ через docker-compose:**
   ```bash
   cd backend
   docker-compose up -d
   ```
   - MongoDB будет доступен на `localhost:27017`
   - RabbitMQ Management UI — [http://localhost:15672](http://localhost:15672), логин/пароль: `guest`/`guest`

---

## Запуск сервисов

Откройте новые терминалы для каждого сервиса:

### 1. User Service
```bash
cd backend/user-service
npm install --legacy-peer-deps
npm run dev
```

### 2. User Worker (обработка очереди users)
```bash
cd backend/user-service
npx ts-node src/user.worker.ts
```

### 3. Course Service
```bash
cd backend/courses-service
npm install --legacy-peer-deps
npm run dev
```

### 4. Course Worker (обработка очереди enrollments)
```bash
cd backend/courses-service
npx ts-node src/enrollment.worker.ts
```

### 5. API Gateway
```bash
cd backend/api-gateway
npm install --legacy-peer-deps
npm run dev
```

---

## Проверка работы очередей RabbitMQ

1. **Откройте RabbitMQ Management UI:**
   - [http://localhost:15672](http://localhost:15672) (логин/пароль: guest/guest)
   - Перейдите во вкладку **Queues**
   - После генерации событий (см. ниже) появятся очереди `users` и `enrollments`

2. **Сгенерируйте события:**
   - Зарегистрируйте пользователя через API Gateway:
     ```http
     POST http://localhost:5001/api/auth/register
     Content-Type: application/json
     {
       "firstName": "Test",
       "lastName": "User",
       "login": "testuser",
       "password": "password",
       "role": "student"
     }
     ```
   - После этого появится очередь `users` и воркер user-service выведет событие в консоль.

   - Запишитесь на курс через API Gateway (требуется авторизация):
     ```http
     POST http://localhost:5001/api/enrollments
     Content-Type: application/json
     Authorization: Bearer <token>
     {
       "courseId": "<id_курса>"
     }
     ```
   - После этого появится очередь `enrollments` и воркер courses-service выведет событие в консоль.

---

## Проверка сервисов через API Gateway

- **Регистрация пользователя:**
  - `POST http://localhost:5001/api/auth/register`
- **Авторизация:**
  - `POST http://localhost:5001/api/auth/login`
- **Получение курсов:**
  - `GET http://localhost:5001/api/courses`
- **Запись на курс:**
  - `POST http://localhost:5001/api/enrollments` (требуется токен)

---

## Важно
- Очереди в RabbitMQ появляются только после первого использования (отправки сообщения).
- Воркер будет выводить сообщения только при поступлении новых событий в очередь.
- Все сервисы должны быть запущены одновременно для корректной работы архитектуры.

---

## Пример архитектуры

```
[Клиент] → [API Gateway:5001] → [user-service:5002] ↔ [MongoDB]
                                 ↓
                                 ↔ [RabbitMQ: users]

[Клиент] → [API Gateway:5001] → [courses-service:5003] ↔ [MongoDB]
                                 ↓
                                 ↔ [RabbitMQ: enrollments]
```
