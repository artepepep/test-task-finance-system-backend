# Finance System Backend

NestJS backend for a simple finance system with users, accounts, transfers, and currency exchange.

## Features

- JWT auth with access + refresh tokens
- Users with EUR/USD accounts created on registration
- Transfers between same-currency accounts with ledger entries
- Currency exchange between user accounts
- TypeORM + PostgreSQL
- Swagger docs at `/docs`
- Pagination for transactions

## Requirements

- Node.js 18+
- Yarn 4+
- PostgreSQL

## Setup

```bash
yarn install
cp .env.example .env
```

Update `.env` with your DB credentials and JWT secrets.

## Run

```bash
# development
yarn start:dev

# production
yarn start:prod
```

## Migrations

```bash
yarn migration:generate src/migrations/YourMigrationName
yarn migration:run
yarn migration:revert
```

## API

- Swagger UI: `http://localhost:3000/docs`
- Auth:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `GET /auth/me` (Bearer token)
- Accounts:
  - `GET /accounts`
  - `POST /accounts/{id}`
- Transactions:
  - `POST /transactions/transfer`
  - `POST /transactions/exchange` (Bearer token)
  - `GET /transactions` (paginated)

## Notes

- Balances are stored as `numeric` and mapped to `string` in TypeORM to avoid floating point issues.
- Exchange uses a static rate constant; update it in `src/shared/constants/exchange-rate`.
