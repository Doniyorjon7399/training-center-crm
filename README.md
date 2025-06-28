# You Academy CRM - To'liq Loyiha Strukturasi

## 1. Loyiha Texnologiyalari

- **Backend**: NestJS + TypeScript
- **Database**: MongoDB + Mongoose ODM
- **Frontend**: React + TypeScript
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Validation**: class-validator

## 2. Ma'lumotlar Bazasi Strukturasi

### 2.1 Users Collection (Foydalanuvchilar)

```typescript
interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.2 Groups Collection (Guruhlar)

```typescript
interface Group {
  _id: ObjectId;
  name: string;
  subject: string;
  teacherId: ObjectId;
  students: ObjectId[];
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  status: 'active' | 'completed' | 'paused';
  maxStudents: number;
  price: number;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.3 Attendance Collection (Davomat)

```typescript
interface Attendance {
  _id: ObjectId;
  groupId: ObjectId;
  date: Date;
  records: Array<{
    studentId: ObjectId;
    status: 'present' | 'absent' | 'late' | 'excused';
    note?: string;
  }>;
  teacherId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.4 Payments Collection (To'lovlar)

```typescript
interface Payment {
  _id: ObjectId;
  studentId: ObjectId;
  groupId: ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'paid' | 'pending' | 'overdue';
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.5 Statistics Collection (Statistika)

```typescript
interface Statistics {
  _id: ObjectId;
  date: Date;
  totalStudents: number;
  totalGroups: number;
  totalRevenue: number;
  attendanceRate: number;
  newStudents: number;
  completedGroups: number;
  createdAt: Date;
}
```

## 3. Backend Strukturasi (NestJS)

### 3.1 Loyiha Folderlari

```
src/
├── app.module.ts
├── main.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── schemas/
│       └── user.schema.ts
├── groups/
│   ├── groups.module.ts
│   ├── groups.controller.ts
│   ├── groups.service.ts
│   ├── dto/
│   └── schemas/
├── attendance/
│   ├── attendance.module.ts
│   ├── attendance.controller.ts
│   ├── attendance.service.ts
│   ├── dto/
│   └── schemas/
├── payments/
│   ├── payments.module.ts
│   ├── payments.controller.ts
│   ├── payments.service.ts
│   ├── dto/
│   └── schemas/
├── statistics/
│   ├── statistics.module.ts
│   ├── statistics.controller.ts
│   ├── statistics.service.ts
│   └── schemas/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── pipes/
│   └── interfaces/
└── config/
    └── database.config.ts
```

### 3.2 Asosiy API Endpointlar

#### Auth Endpoints

```
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
```

#### Users Endpoints

```
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
GET /users/teachers
GET /users/students
```

#### Groups Endpoints

```
GET /groups
GET /groups/:id
POST /groups
PUT /groups/:id
DELETE /groups/:id
POST /groups/:id/add-student
DELETE /groups/:id/remove-student/:studentId
```

#### Attendance Endpoints

```
GET /attendance/group/:groupId
POST /attendance
PUT /attendance/:id
GET /attendance/student/:studentId
GET /attendance/statistics/:groupId
```

#### Payments Endpoints

```
GET /payments
GET /payments/student/:studentId
POST /payments
PUT /payments/:id
DELETE /payments/:id
GET /payments/statistics
```

#### Statistics Endpoints

```
GET /statistics/overview
GET /statistics/attendance
GET /statistics/revenue
GET /statistics/students
```

## 4. Frontend Strukturasi (React)

### 4.1 Component Strukturasi

```
src/
├── components/
│   ├── common/
│   │   ├── Layout/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   ├── Modal/
│   │   └── Button/
│   ├── auth/
│   │   ├── LoginForm/
│   │   └── AuthGuard/
│   ├── groups/
│   │   ├── GroupCard/
│   │   ├── GroupForm/
│   │   └── GroupList/
│   ├── students/
│   │   ├── StudentCard/
│   │   ├── StudentForm/
│   │   └── StudentList/
│   ├── attendance/
│   │   ├── AttendanceTable/
│   │   └── AttendanceForm/
│   ├── payments/
│   │   ├── PaymentForm/
│   │   └── PaymentList/
│   └── statistics/
│       ├── StatChart/
│       └── StatCard/
├── pages/
│   ├── Dashboard/
│   ├── Groups/
│   ├── Students/
│   ├── Teachers/
│   ├── Attendance/
│   ├── Payments/
│   ├── Statistics/
│   └── Settings/
├── hooks/
│   ├── useAuth.ts
│   ├── useGroups.ts
│   ├── useStudents.ts
│   └── useStatistics.ts
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── groups.service.ts
│   └── students.service.ts
├── utils/
│   ├── helpers.ts
│   ├── constants.ts
│   └── validators.ts
└── styles/
    ├── globals.css
    └── components/
```

## 5. Qilinadigan Ishlar (Features)

### 5.1 Autentifikatsiya

- [x] Login sahifasi (matematik captcha bilan)
- [x] JWT token bilan himoyalash
- [x] Rol-based access control
- [x] Password reset

### 5.2 Dashboard

- [x] Umumiy statistika
- [x] Guruhlar ko'rsatkichi
- [x] O'quvchilar statistikasi
- [x] Davomat hisoboti

### 5.3 Guruhlar Boshqaruvi

- [x] Guruh yaratish
- [x] Guruh tahrirlash
- [x] O'quvchi qo'shish/olib tashlash
- [x] Dars jadvali boshqaruvi
- [x] Guruh statistikasi

### 5.4 Davomat Tizimi

- [x] Kunlik davomat kiritish
- [x] Davomat ko'rish (haftalik/oylik)
- [x] Davomat statistikasi
- [x] Sababli/sababsiz yo'qotish

### 5.5 To'lov Tizimi

- [x] To'lov qo'shish
- [x] To'lov tarixi
- [x] Qarzdorlar ro'yxati
- [x] To'lov statistikasi

### 5.6 Foydalanuvchilar

- [x] O'quvchi qo'shish
- [x] O'qituvchi qo'shish
- [x] Profil tahrirlash
- [x] Foydalanuvchi holati

### 5.7 Hisobotlar

- [x] Davomat hisoboti
- [x] Moliyaviy hisobot
- [x] O'quvchilar statistikasi
- [x] Guruhlar hisoboti

## 6. Ma'lumotlar Bazasi Munnosabatlari

```
Users (1) ←→ (N) Groups (teacher)
Users (N) ←→ (N) Groups (students)
Groups (1) ←→ (N) Attendance
Users (1) ←→ (N) Payments (student)
Groups (1) ←→ (N) Payments
```

## 7. Xavfsizlik Choralari

- JWT token authentication
- Password hashing (bcrypt)
- Input validation
- Role-based permissions
- API rate limiting
- CORS configuration

## 8. Deployment

### 8.1 Backend Deployment

- PM2 bilan process management
- Nginx reverse proxy
- SSL sertifikati
- MongoDB Atlas yoki local MongoDB

### 8.2 Frontend Deployment

- React build
- Static file serving
- CDN integration

## 9. Kelajakdagi Rivojlantirish

- Mobile app (React Native)
- SMS/Email notifications
- Online dars tizimi
- Video dars saqlash
- Parent portal
- Multi-branch support

## 10. Texnik Talablar

- Node.js 18+
- MongoDB 5.0+
- React 18+
- TypeScript 4.8+
- Modern browser support
