# You Academy CRM

## Texnologiyalar

- **Backend:** NestJS (TypeScript)
- **Database:** MongoDB (Prisma ORM)
- **Frontend:** React (TypeScript)
- **Authentication:** JWT
- **Email:** Nodemailer
- **Redis:** Kesh va kodlar uchun

## Loyiha Tuzilmasi

```
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── auth/
│   ├── admin/
│   ├── teacher/
│   ├── avatar/
│   └── paymets/
├── common/
│   ├── guards/
│   └── interceptors/
├── config/
├── database/
│   ├── prisma.service.ts
│   ├── prisma.module.ts
│   └── seeders/
├── utils/
│   ├── mail.service.ts
│   └── mail.module.ts
```

## O‘rnatish va Ishga Tushirish

```bash
git clone <repo-url>
cd CrmProject
yarn install # yoki npm install
yarn start:dev # yoki npm run start:dev
```

## .env namunasi

Quyidagi o‘zgaruvchilar kerak:

```
PORT=
DB_URL=
JWT_SECRET_KEY=
JWT_EXPIRES_IN=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SUPER_ADMIN_FIRSTNAME=
SUPER_ADMIN_LASTNAME=
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PHONE=
REDIS_HOST=
REDIS_PORT=
```

## Asosiy API Endpointlar

- `POST   /auth/login`
- `POST   /auth/forgot-password`
- `POST   /auth/forgot-password/pin`
- `POST   /auth/logout`
- `GET    /admin/...`
- `GET    /teacher/...`
- `GET    /paymets/...`
- `GET    /avatar/...`

## Texnik Talablar

- Node.js 18+
- MongoDB 5.0+
- Redis 5+
- Yarn yoki npm

## Xavfsizlik

- JWT token authentication
- Bcrypt password hashing
- Input validation
- Role-based access control

## Qo‘shimcha

- Email orqali kod yuborish
- Super admin avtomatik yaratiladi
- Kesh uchun Redis

---

Loyiha haqida batafsil ma’lumot va kengaytma uchun kodni o‘qing yoki muallifga murojaat qiling.
