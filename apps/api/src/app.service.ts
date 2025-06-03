import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Selamat datang! API version 1 sedang berjalan dengan baik.';
  }
}
