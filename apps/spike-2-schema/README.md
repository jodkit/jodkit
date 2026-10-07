# Spike 2: metadata to PostgreSQL migration

`defineCollection` metadata -> reviewable SQL -> apply with single ledger table.

## Setup

```bash
cd apps/spike-2-schema
npm install
cp .env.example .env
# edit DATABASE_URL for your PostgreSQL
```

Requires PostgreSQL with `gen_random_uuid()` (pgcrypto extension is default on many installs).

## Generate SQL from metadata

```bash
npm run generate
```

Writes [migrations/001_jodkit_products.sql](migrations/001_jodkit_products.sql) from [src/collections/products.ts](src/collections/products.ts).

## Apply migrations

```bash
npm run migrate
```

Uses ledger table `jodkit_schema_migrations`.

## Test

```bash
npm test
```

Unit tests always run. Integration tests run only when `DATABASE_URL` is set.

## Spike log

See [SPIKE.md](./SPIKE.md).
