// apps/api/src/main.ts
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as bcrypt from 'bcrypt';

// === Swagger ===
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// === App Module & Services ===
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

// === DTO & Enums untuk seeding ===
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserRole, SubscriptionPlan } from './users/entities/user.entity';

// === GLOBAL EXCEPTION FILTER (TANGKAP SEMUA ERROR) ===
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)
        : { message: 'Internal server error' };

    response.status(status).json({
      success: false,
      message:
        typeof message === 'string'
          ? message
          : message?.message || 'Terjadi kesalahan pada server',
      ...(process.env.NODE_ENV === 'development' && {
        error: exception instanceof Error ? exception.stack : String(exception),
      }),
    });
  }
}

// FORCE SEMUA new Date() MENGGUNAKAN UTC (INI YANG BIKIN STATISTIK & STREAK SELALU BENAR!)
process.env.TZ = 'UTC';
console.log('Server timezone: UTC (forced)');

// === BOOTSTRAP ===
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // ClassSerializerInterceptor (untuk @Exclude() di entity)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // === CORS ===
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://moodsync-web-production.up.railway.app',
    'https://moodsync-web.up.railway.app',
    process.env.CORS_ORIGIN,
    process.env.RAILWAY_STATIC_URL ? `https://${process.env.RAILWAY_STATIC_URL}` : null,
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  console.log('Allowed CORS origins:', allowedOrigins.filter(Boolean));

  // === Global Prefix ===
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // === Swagger Documentation ===
  const config = new DocumentBuilder()
    .setTitle('MoodSync API')
    .setDescription('REST API untuk aplikasi MoodSync – Journal, Mood Tracking & Wellness')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // === Dummy Test User (hanya di development) ===
  if (process.env.NODE_ENV !== 'production') {
    try {
      const usersService = app.get(UsersService);
      const testEmail = 'test@example.com';

      const existing = await usersService.findByEmail(testEmail);
      if (!existing) {
        const hashed = await bcrypt.hash('password', 10);
        await usersService.create({
          username: 'testuser',
          email: testEmail,
          password_hash: hashed,
          full_name: 'Test User',
          role: UserRole.PERSONAL,
          subscription_plan: SubscriptionPlan.FREE,
          onboarding_completed: false,
          privacy_settings: {},
        } as CreateUserDto);
        console.log('Test user created: test@example.com / password');
      } else {
        console.log('Test user already exists');
      }
    } catch (err) {
      console.error('Failed to create test user:', err);
    }
  }

  // === Health Check Endpoint ===
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // === Trust Proxy (Railway, Render, dll) ===
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // === Start Server ===
  const port = process.env.PORT || 5000;
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

  await app.listen(port, host);

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? `https://${process.env.RAILWAY_STATIC_URL || 'your-domain.com'}`
      : `http://localhost:${port}`;

  console.log('MoodSync API is running!');
  console.log(`URL: ${baseUrl}/${apiPrefix}`);
  console.log(`Docs: ${baseUrl}/docs`);
  console.log(`Health: ${baseUrl}/health`);
}

bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});