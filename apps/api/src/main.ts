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

  // === CORS Configuration - Using Environment Variables ===
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', // Additional local development port
    process.env.CORS_ORIGIN, // From environment variable
    'https://moodsync-web-production.up.railway.app', // Actual frontend URL
    'https://moodsync-web.up.railway.app', // Backup URL
    process.env.RAILWAY_STATIC_URL ? `https://${process.env.RAILWAY_STATIC_URL}` : null,
  ].filter(Boolean); // Remove null values

  app.enableCors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
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
    optionsSuccessStatus: 204, // For legacy browser support
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

  // === Railway specific configurations ===
  // Trust proxy for Railway
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  
  // Add health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // === Start App ===
  const port = process.env.PORT || 5000;
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  
  await app.listen(port, host);

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.RAILWAY_STATIC_URL || 'your-app-name.up.railway.app'}`
    : `http://localhost:${port}`;

  console.log(`🚀 App running at: ${baseUrl}/${apiPrefix}`);
  console.log(`📘 Swagger docs at: ${baseUrl}/docs`);
  console.log(`💚 Health check at: ${baseUrl}/health`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});