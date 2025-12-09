# MoodSync - Mood Tracker Backend Setup Guide

## 📋 Struktur File yang Dibuat

```
apps/
├── api/
│   └── src/
│       └── mood-entry/
│           ├── dto/
│           │   ├── create-mood-entry.dto.ts
│           │   ├── update-mood-entry.dto.ts
│           │   ├── mood-entry-response.dto.ts
│           │   ├── query-mood-entries.dto.ts
│           │   └── index.ts
│           ├── entities/
│           │   └── mood-entry.entity.ts
│           ├── mood-entry.controller.ts
│           ├── mood-entry.service.ts
│           └── mood-entry.module.ts
└── web/
    └── src/
        ├── services/
        │   └── api/
        │       └── moodApi.ts
        └── app/
            └── mood-tracker/
                └── page.tsx (updated)
```

## 🚀 Langkah-Langkah Setup

### 1. Backend Setup (NestJS)

#### a. Install Dependencies
```bash
cd apps/api
npm install @nestjs/typeorm typeorm mysql2 class-validator class-transformer @nestjs/swagger
```

#### b. Buat Struktur Folder
```bash
mkdir -p src/mood-entry/dto
mkdir -p src/mood-entry/entities
```

#### c. Copy Files Backend
Salin semua file yang telah dibuat:
- `mood-entry.entity.ts` ke `src/mood-entry/entities/`
- Semua DTOs ke `src/mood-entry/dto/`
- `mood-entry.service.ts` ke `src/mood-entry/`
- `mood-entry.controller.ts` ke `src/mood-entry/`
- `mood-entry.module.ts` ke `src/mood-entry/`

#### d. Buat index.ts untuk DTOs
```typescript
// src/mood-entry/dto/index.ts
export * from './create-mood-entry.dto';
export * from './update-mood-entry.dto';
export * from './mood-entry-response.dto';
export * from './query-mood-entries.dto';
```

#### e. Register Module di AppModule
```typescript
// src/app.module.ts
import { MoodEntryModule } from './mood-entry/mood-entry.module';

@Module({
  imports: [
    // ... other imports
    MoodEntryModule,
  ],
})
export class AppModule {}
```

#### f. Update TypeORM Configuration
```typescript
// src/config/database.config.ts atau app.module.ts
TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'moodsync',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development', // Hati-hati di production!
}),
```

#### g. Environment Variables
Buat file `.env` di `apps/api/`:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=moodsync

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=development
```

### 2. Frontend Setup (Next.js)

#### a. Install Dependencies
```bash
cd apps/web
npm install axios react-hot-toast
```

#### b. Buat Struktur Folder
```bash
mkdir -p src/services/api
```

#### c. Copy Files Frontend
- `moodApi.ts` ke `src/services/api/`
- Updated `page.tsx` ke `src/app/mood-tracker/`

#### d. Environment Variables
Buat file `.env.local` di `apps/web/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### e. Setup Toast Provider
```typescript
// src/app/layout.tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### 3. Database Setup

#### a. Jalankan MySQL
Pastikan MySQL server berjalan di komputer Anda.

#### b. Buat Database
```sql
CREATE DATABASE moodsync CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### c. Generate Tables
Karena kita menggunakan `synchronize: true` di development, TypeORM akan otomatis membuat tabel saat aplikasi pertama kali dijalankan.

**⚠️ PENTING**: Untuk production, gunakan migrations:
```bash
npm run typeorm migration:generate -- -n CreateMoodEntryTable
npm run typeorm migration:run
```

### 4. Jalankan Aplikasi

#### a. Start Backend
```bash
cd apps/api
npm run start:dev
```

Backend akan berjalan di `http://localhost:3001`

#### b. Start Frontend
```bash
cd apps/web
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 5. Testing API Endpoints

#### a. Menggunakan Swagger
Akses `http://localhost:3001/api/docs` untuk melihat dokumentasi API interaktif.

#### b. Menggunakan cURL atau Postman

**Login terlebih dahulu** (sesuaikan dengan auth system Anda):
```bash
POST http://localhost:3001/api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Simpan token** yang diterima, lalu gunakan untuk endpoint mood:

**Create Mood Entry:**
```bash
POST http://localhost:3001/api/mood-entries
Headers: Authorization: Bearer YOUR_TOKEN
Body:
{
  "mood": "happy",
  "intensity": 8,
  "energy": 7,
  "stress": 3,
  "anxiety": 2,
  "happiness": 9,
  "note": "Had a great day!",
  "tags": ["work", "achievement"]
}
```

**Get Recent Entries:**
```bash
GET http://localhost:3001/api/mood-entries/recent?days=7
Headers: Authorization: Bearer YOUR_TOKEN
```

**Get Statistics:**
```bash
GET http://localhost:3001/api/mood-entries/statistics?days=30
Headers: Authorization: Bearer YOUR_TOKEN
```

## 🔐 Keamanan & Best Practices

### 1. JWT Authentication
Pastikan semua endpoint mood-entry dilindungi dengan `JwtAuthGuard`:
```typescript
@UseGuards(JwtAuthGuard)
@Controller('mood-entries')
export class MoodEntryController { ... }
```

### 2. Validasi Input
Semua input sudah divalidasi menggunakan `class-validator` di DTOs.

### 3. User Isolation
Service sudah memastikan user hanya bisa akses data mereka sendiri dengan parameter `userId`.

### 4. Error Handling
```typescript
// Di frontend (moodApi.ts)
try {
  const data = await moodApi.createMoodEntry(payload);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 400) {
    // Handle validation errors
  }
}
```

## 📊 Fitur yang Tersedia

### Backend Endpoints:
- ✅ POST `/mood-entries` - Create mood entry
- ✅ GET `/mood-entries` - Get all entries with pagination
- ✅ GET `/mood-entries/recent` - Get recent entries
- ✅ GET `/mood-entries/statistics` - Get mood statistics
- ✅ GET `/mood-entries/:id` - Get single entry
- ✅ PATCH `/mood-entries/:id` - Update entry
- ✅ DELETE `/mood-entries/:id` - Delete entry

### Frontend Features:
- ✅ Mood wheel untuk memilih mood
- ✅ Intensity slider
- ✅ Tags selection
- ✅ Notes input
- ✅ Real-time statistics
- ✅ Recent entries display
- ✅ Toast notifications
- ✅ Loading states

## 🎯 Next Steps

1. **Tambahkan fitur photo upload** untuk `photo_url`
2. **Implementasi voice note** untuk `voice_note_url`
3. **Tambahkan mood insights** menggunakan AI
4. **Buat mood charts** dengan Recharts
5. **Export data** ke CSV/PDF
6. **Mood patterns detection**

## 🐛 Troubleshooting

### Database Connection Error
```
Error: ER_ACCESS_DENIED_ERROR
```
**Solusi**: Periksa username, password, dan host di `.env`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solusi**: Tambahkan CORS di `main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### 401 Unauthorized
**Solusi**: Pastikan token JWT valid dan tidak expired. Periksa localStorage atau cookies.

## 📝 Notes

- Schema database sudah sesuai dengan ERD yang Anda berikan
- Semua tipe data dan relasi sudah diimplementasikan dengan benar
- Service menggunakan TypeORM untuk query yang efisien
- Frontend sudah terintegrasi dengan loading states dan error handling

Selamat coding! 🚀