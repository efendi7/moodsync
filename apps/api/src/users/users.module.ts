// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfile } from '../user-profile/entities/user-profile.entity'; 
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])], // Register User entity
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export untuk digunakan di AuthModule
})
export class UsersModule {}