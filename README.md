# WB-<Ignatenko.Maria>-Suppliers (Фаза 2)

Проект выполнен в рамках производственной практики (ПМ.02 — Интеграция программных модулей) 
на базе команды "Поставки" портала продавцов Wildberries. 
Это клиент-серверное приложение с фронтендом (React + Redux) и бэком (Node.js + Express), интегрированным через REST API.

## Описание
- **Цель:** Разработка серверной части для управления поставками, включая авторизацию и регистрацию, CRUD-операции и автоматизацию бизнес-логики.
- **Платформа:** GitHub
- **База данных:** PostgreSQL 

## Установка

### Установка зависимостей 
#### Бэкенд (`my-app-server`)
Зависимости:
"dependencies": {
    "@types/express": "^5.0.0",
    "bcrypt": "^6.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "node-cron": "^4.1.0",
    "pg": "^8.16.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.2",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/dotenv": "^6.1.1",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/node": "^24.0.0",
    "@types/pg": "^8.15.4",
    "@types/ws": "^8.5.13",
    "nodemon": "^3.1.10"
  }

Команда установки:
cd my-app-server
npm install

#### Фронтенд (`my-app`):
Зависимости:
"dependencies": {
    "@reduxjs/toolkit": "^2.5.0",
    "axios": "^1.7.9",
    "cra-template-typescript": "1.2.0",
    "react": "^19.0.0",
    "react-day-picker": "^9.4.4",
    "react-dom": "^19.0.0",
    "react-redux": "^9.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^4.2.4",
    "typescript": "^5.7.2"
  },
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11",
    "@testing-library/react": "^16.1.0",
    "@types/axios": "^0.9.36",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2"
  }

Команда установки:
cd my-app
npm install

## Настройка переменных окружения

Файл `.env` в папке `my-app-server`:

DATABASE_URL=postgresql://postgres:root@localhost:5432/supplies
JWT_SECRET='f533a36a1b7413adb9cd8c5f13ae2f90'
PORT=3001

## Команды запуска

- **Запуск бэкенда:**
cd my-app-server
npm run dev

- **Запуск фронтенда:**
cd my-app
npm start


## Описание API

API реализовано на бэкенде (`my-app-server`). Основные эндпоинты:

### Пользователи
- `POST /auth/register` — Регистрация пользователя
- `POST /auth/login` — Вход в систему
- `GET /auth/me` — Получение данных текущего пользователя (требуется авторизация)
- `PATCH /auth/me` - Обновление данных текущего пользователя (требуется авторизация)

### Поставки
- `GET /shipments` — Получение списка поставок
- `GET /shipments/:id` — Получение поставки по ID
- `POST /shipments` — Создание новой поставки
- `PUT /shipments/:id` — Обновление поставки
- `DELETE /shipments/:id` — Удаление поставки

### Склады
- `GET /warehouses` — Получение списка складов

### Справочники
- Города, типы поставок, статусы хранятся в JSON.

## Автоматизация
- Автообновление статуса "Задерживается", если `deliveryDate < today` и статус "В пути".
- Логирование изменений в таблице `Log`.

## Структура репозитория
WB-<Ignatenko.Maria>-Suppliers/
├── my-app/           # Фронтенд (React)
├── my-app-server/    # Бэкенд (Node.js + Express)
├── README.md         # Документация
└── .gitignore        # Игнорируемые файлы




