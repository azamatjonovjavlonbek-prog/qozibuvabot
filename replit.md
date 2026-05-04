# Huquqiy Xizmatlar Telegram Bot

## Overview

O'zbekistonda huquqiy xizmatlar uchun Telegram bot. Foydalanuvchilar karta orqali to'lov qilib sud arizalarini yuklab olishlari va huquqiy konsultatsiya olishlari mumkin.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Telegram**: node-telegram-bot-api (polling mode)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Bot Xizmatlari

### Ariza bo'limi (15 000 so'm)
- Nikohdan ajratish arizasi
- Aliment to'lash arizasi
- Mulkni bo'lish arizasi
- Farzand vasiyligini aniqlash
- Qarz undirish arizasi
- Mehnat nizosi arizasi
- Boshqa ariza

### Konsultatsiya bo'limi (50 000 so'm)
- To'lovdan keyin telefon raqam yuboriladi
- Ish vaqti: 10:00 dan 20:00 gacha

## Muhim Sozlamalar

- `TELEGRAM_BOT_TOKEN` — Telegram bot tokeni (@BotFather dan)
- `PAYMENT_PROVIDER_TOKEN` — To'lov tizimi tokeni (Payme/Click/Telegram Payments)

## Fayl Strukturasi

```
artifacts/api-server/src/
├── bot/
│   ├── index.ts        — Bot ishga tushirish
│   ├── config.ts       — Narxlar, ariza turlari, telefon raqami
│   ├── state.ts        — Foydalanuvchi holati (xotira)
│   ├── keyboards.ts    — Inline tugmalar
│   └── handlers.ts     — Bot mantiqiy qismi + ariza shablonlari
├── app.ts              — Express ilovasi
└── index.ts            — Kirish nuqtasi
```

## Sozlash

Yangi xizmat qo'shish uchun:
1. `bot/config.ts` da yangi ariza turini qo'shing
2. `bot/handlers.ts` da yangi shablon funksiyasini qo'shing
3. Konsultatsiya telefon raqamini `bot/config.ts` da `CONSULTATION_PHONE` ga o'zgartiring

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
