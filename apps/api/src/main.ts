import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

// === Swagger Import ===
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // === Global Validation Pipe ===
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // === CORS Configuration ===
  const allowedOrigins = [
    'http://localhost:3000',
    'https://moodsync-web-production.up.railway.app',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  console.log('✅ Allowed CORS origins:', allowedOrigins);

  // === Global API Prefix ===
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // === Swagger Setup ===
  const config = new DocumentBuilder()
    .setTitle('MoodSync API')
    .setDescription('Dokumentasi REST API untuk MoodSync')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // === Optional: Dummy test user ===
  try {
    const userService = app.get(UsersService);
    const email = 'test@example.com';
    const existingUser = await userService.findByEmail(email);

    if (!existingUser) {
      const password = await bcrypt.hash('password', 10);
      await userService.create({
        name: 'Test User',
        email,
        password,
      });
      console.log('✅ Test user created successfully');
    } else {
      console.log('ℹ️ Test user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }

  // === Start App ===
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 App running at: http://localhost:${port}/${apiPrefix}`);
  console.log(`📘 Swagger docs at: http://localhost:${port}/docs`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
