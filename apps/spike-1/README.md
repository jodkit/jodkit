# Spike 1: Fastify + kernel boot

Minimal runtime proof for [implementation-spikes.md](../../docs/research/implementation-spikes.md#spike-1-fastify--jodkit-kernel-boot).

## Setup

```bash
cd apps/spike-1
npm install
```

## Test (required)

```bash
npm test
```

## Run server

```bash
npm run dev
```

Then `GET http://127.0.0.1:3000/health` should return `{"ok":true,"version":"0.1.0"}`.

Optional env: `HOST`, `PORT`.

## Spike log

See [SPIKE.md](./SPIKE.md).
