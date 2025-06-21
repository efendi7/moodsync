import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

// === Swagger Import ===
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS Configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Global API Prefix
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

  // === Swagger Setup ===
  const config = new DocumentBuilder()
    .setTitle('MoodSync API')
    .setDescription('Dokumentasi REST API untuk MoodSync')
    .setVersion('1.0')
    .addBearerAuth() // jika kamu pakai JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // buka http://localhost:5000/docs

  // Dummy user (optional)
  try {
    const userService = app.get(UsersService);
    const password = await bcrypt.hash('password', 10);

    const existingUser = await userService.findByEmail('test@example.com');
    if (!existingUser) {
      await userService.create({
        name: 'Test User',
        email: 'test@example.com',
        password,
      });
      console.log('✅ Test user created successfully');
    } else {
      console.log('ℹ️ Test user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  }

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📘 Swagger docs available at: http://localhost:${port}/docs`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
