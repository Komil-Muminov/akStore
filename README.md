# gatePass

Пропускная система. Клиент — GPUIX (`@gpuix/react`), нативное GPU-приложение на
React без DOM. Сервер — Express + PostgreSQL. Правила проекта — в [GEMINI.md](GEMINI.md).

## Запуск

```bash
cp .env.example .env
npm run dev
```

`dev` поднимает сервер (`server/index.ts`, автосоздание схемы в PostgreSQL)
и клиент (`bun --hot app.tsx`) одновременно. Нужен запущенный PostgreSQL по
`DATABASE_URL` из `.env`.

## Скрипты

| Скрипт | Что делает |
|---|---|
| `npm run app:dev` | Только клиент, hot remount на том же окне |
| `npm run server:dev` | Только сервер, перезапуск при изменениях |
| `npm run dev` | Сервер + клиент |
| `npm run build` | Бинарник `dist/gatePass` |
| `npm run web:dev` | Сборка под браузер и сервер на `:4173` |
| `npm run screenshot` | PNG окна через automation-клиент |
| `npm test` | Vitest через GPU test-renderer |
| `npm run typecheck` | `tsc --noEmit` |

## Структура

```
app.tsx                 точка входа клиента
src/
  app/                  провайдеры, ErrorBoundary, lazy-роутер
  pages/                монтирование экранов (Пропуска, Структура)
  widgets/              оркестраторы: Layout, Passes, Structure
  features/             UI по пропсам (OrgCanvas — холст с drag & drop)
  entities/             pass, unit (дерево + автораскладка), position
  shared/               config (theme, routes, queryKeys, env), hooks, lib, ui
server/
  index.ts              Express, auth, routes, initDb
  routes/ services/ db/ types/ middleware/ shared/utils/
tests/                  тесты
assets/icons/           lucide SVG
.env.example            единственный шаблон конфига, .env в .gitignore
```

## API

Все запросы с заголовком `Authorization: Bearer <API_TOKEN>`. Ответ — `{ data }`, ошибка — `{ message }`.

| Метод | Путь | Роль | Что делает |
|---|---|---|---|
| GET | `/passes/search` | admin, guard | Список пропусков |
| POST | `/passes/create` | admin | Выдать пропуск |
| PATCH | `/passes/update/:id` | admin | Изменить данные пропуска |
| PATCH | `/passes/deactivate/:id` | admin | Отозвать (проход запрещён) |
| PATCH | `/passes/activate/:id` | admin | Восстановить отозванный |
| DELETE | `/passes/delete/:id` | admin | Удалить безвозвратно |

Поля пропуска: `holderName` (посетитель, обязательно), `hostName` (к кому, обязательно),
`organization`, `purpose`, `phone`, `carPlate`.

### Структура организации

| Метод | Путь | Что делает |
|---|---|---|
| GET | `/positions/search` | Справочник должностей |
| POST | `/positions/create` | Добавить должность (`name`, `rank`) |
| PATCH | `/positions/update/:id` | Изменить должность |
| DELETE | `/positions/delete/:id` | Удалить (если не назначена в подразделениях) |
| GET | `/units/search` | Дерево подразделений с `positionIds` и координатами |
| POST | `/units/create` | Создать (`name`, `type`, `parentId`, `x`, `y`) |
| PATCH | `/units/update/:id` | Переименовать / сохранить координаты |
| PATCH | `/units/move/:id` | Привязать к другому родителю (`parentId`) |
| PATCH | `/units/set-layout` | Массово сохранить координаты (`items`) |
| PATCH | `/units/set-positions/:id` | Назначить должности (`positionIds`) |
| DELETE | `/units/delete/:id` | Удалить (без дочерних) |

Типы подразделений и допустимые родители: `leadership` (корень «Руководство», один,
не удаляется) → `management` → `department` → `section`. Сервер отклоняет привязку
к родителю другого типа и циклы. При первом старте создаются должности по умолчанию
и корневой узел «Руководство».

Схема БД обновляется идемпотентно при старте сервера (`initDb`), ручные миграции не нужны.
