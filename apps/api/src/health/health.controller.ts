// src/health/health.controller.ts
// Optional: Tambahkan health check endpoint untuk monitoring

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Server is healthy' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}

// ========================================
// Jangan lupa daftarkan di app.module.ts:
// ========================================
// import { HealthController } from './health/health.controller';
//
// @Module({
//   controllers: [
//     HealthController, // <-- TAMBAHKAN INI
//     // ... controllers lain
//   ],
// })