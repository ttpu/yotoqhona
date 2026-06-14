# TalabaJoy

Talabalar uchun yotoqxona, xostel va ijaradagi turar joylarni qidirish, taqqoslash, ariza yuborish va boshqarish platformasi.

## Texnologiyalar

- Next.js 14 (App Router + API Routes)
- TypeScript
- Prisma ORM
- PostgreSQL

## Loyihani ishga tushirish

1. Kutubxonalarni o'rnating:

```bash
npm install
```

2. Muhit faylini yarating:

```bash
cp .env.example .env
```

3. Prisma client generatsiya qiling:

```bash
npm run db:generate
```

4. Dev serverni ishga tushiring:

```bash
npm run dev
```

5. Brauzerda oching:

http://localhost:3000

## Foydali buyruqlar

```bash
npm run build
npm run start
npm run lint
npm run db:push
npm run db:studio
```

## PostgreSQL tezkor ishga tushirish

```bash
docker compose up -d
```

## Xatolik bo'lsa (MODULE_NOT_FOUND, 500)

Ba'zida Next.js kesh fayllari buzilishi mumkin. Quyidagilarni bajaring:

```bash
pkill -f "next dev" || true
rm -rf .next
npm run dev
```

## Eslatma

- OneID hozircha integration-ready mock ko'rinishida.
- To'lov provayderlari (Click, Payme, Uzum, Paynet) uchun API shakli tayyorlangan.
- Hisob statuslari va verifikatsiya bannerlari dashboardlarda ko'rsatiladi.