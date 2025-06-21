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

  // === CORS Configuration - Simplified and more permissive for debugging ===
  app.enableCors({
    origin: true, // Temporarily allow all origins for debugging
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200, // Changed from 204 to 200
  });

  // === Railway specific configurations - MOVED BEFORE setGlobalPrefix ===
  // Trust proxy for Railway
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

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

  // === Health check endpoint - BEFORE starting the app ===
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      routes: 'Auth routes should be available at /' + apiPrefix + '/auth/*'
    });
  });

  // === Debug: Log all registered routes ===
  if (process.env.NODE_ENV !== 'production') {
    const server = app.getHttpAdapter().getInstance();
    console.log('🔍 Registered routes:');
    server._router.stack.forEach((middleware) => {
      if (middleware.route) {
        console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
      }
    });
  }

  // === Optional: Dummy test user (only in development) ===
  if (process.env.NODE_ENV !== 'production') {
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
  }

  // === Start App ===
  const port = process.env.PORT || 5000;
  const host = '0.0.0.0'; // Always bind to 0.0.0.0 for Railway
  
  await app.listen(port, host);

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_PUBLIC_DOMAIN || 'your-app-name.up.railway.app'}`
    : `http://localhost:${port}`;

  console.log(`🚀 App running at: ${baseUrl}`);
  console.log(`📘 API available at: ${baseUrl}/${apiPrefix}`);
  console.log(`📘 Swagger docs at: ${baseUrl}/docs`);
  console.log(`💚 Health check at: ${baseUrl}/health`);
  console.log(`🔑 Auth endpoints at: ${baseUrl}/${apiPrefix}/auth/*`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});