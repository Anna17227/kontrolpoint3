# Fastify Pug Users DB

Третья контрольная работа.

## Описание

Проект создан на Fastify. Статика раздаётся через `fastify-static`, HTML не инлайновый, страницы написаны на Pug. Пользователи хранятся в базе данных SQLite.

## Что реализовано

- `GET /` — редирект на `/users`.
- `GET /users` — список пользователей из базы данных.
- `GET /users/create` — форма создания пользователя.
- `POST /users` — создание пользователя в базе данных.
- `GET /users/:id/edit` — форма редактирования пользователя.
- `POST /users/:id` — обновление пользователя в базе данных.
- `POST /users/:id/delete` — удаление пользователя из базы данных.
- При первом запуске база автоматически создаётся и заполняется тестовыми пользователями.

## Структура проекта

```text
.
├── data/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── src/
│   └── database.js
├── views/
│   ├── create-user.pug
│   ├── edit-user.pug
│   ├── layout.pug
│   ├── not-found.pug
│   └── users.pug
├── package.json
├── server.js
└── README.md
```

## Запуск

```bash
npm install
npm start
```

После запуска открыть:

```text
http://localhost:3000
```

Главная страница автоматически перенаправит на:

```text
http://localhost:3000/users
```

## Ссылка на репозиторий

После публикации на GitHub:

```text
https://github.com/<ваш-login>/fastify-pug-users-db
```
