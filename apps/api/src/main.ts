import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

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

  // === CORS - Allow all for debugging ===
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // === Railway Configuration ===
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // === Global API Prefix ===
  app.setGlobalPrefix('api/v1');

  // === Health Check ===
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString() 
    });
  });

  // === Simple test endpoint ===
  app.getHttpAdapter().get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
  });

  // === Start Server ===
  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📋 Test endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /test`);
  console.log(`   POST /api/v1/auth/register`);
}

bootstrap().catch(console.error);