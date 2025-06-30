// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, SubscriptionPlan } from './entities/user.entity'; // Import enums from User entity
import { CreateUserDto } from './dto/create-user.dto';
import { UserProfile } from '../user-profile/entities/user-profile.entity'; 
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto'; // Make sure this DTO is defined
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,  @InjectRepository(UserProfile) // Injeksi UserProfileRepository
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      select: [
        'id', 'username', 'email', 'full_name', 'profilePicture', 'googleId',
        'created_at', 'updated_at', 'avatar_url', 'timezone', 'language',
        'role', 'subscription_plan', 'subscription_expires_at',
        'email_verified_at', 'onboarding_completed',
      ], // Fix: use correct property names (snake_case, full_name, username)
    });
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> { // Fix: id is string
    const user = await this.userRepository.findOne({
      where: { id }, // Fix: id is string
      select: [
        'id', 'username', 'email', 'full_name', 'profilePicture', 'googleId',
        'created_at', 'updated_at', 'avatar_url', 'timezone', 'language',
        'role', 'subscription_plan', 'subscription_expires_at',
        'email_verified_at', 'onboarding_completed',
      ], // Fix: use correct property names
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new UserResponseDto(user);
  }

  // ADD: Missing findById method that AuthService needs - this should return User entity directly
  async findById(id: string): Promise<User | null> { // Fix: id is string
    return await this.userRepository.findOne({
      where: { id }, // Fix: id is string
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // Add findByUsername method for consistency with AuthService
  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

 async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log('🔍 Creating user with email:', createUserDto.email);
      const existingUserByEmail = await this.findByEmail(createUserDto.email);
      if (existingUserByEmail) {
        throw new ConflictException('Email sudah terdaftar');
      }
      const existingUserByUsername = await this.findByUsername(createUserDto.username);
      if (existingUserByUsername) {
        throw new ConflictException('Username sudah digunakan');
      }

      // 1. Buat User baru
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);

      // 2. Buat UserProfile dasar untuk user baru
      const userProfile = this.userProfileRepository.create({
        user_id: savedUser.id, // Gunakan ID dari user yang baru disimpan
        user: savedUser, // Hubungkan entitas User ke UserProfile
        // Anda bisa menambahkan nilai default lain untuk profil di sini jika ada
      });
      await this.userProfileRepository.save(userProfile); // Simpan profil

      console.log('✅ User and UserProfile created successfully with ID:', savedUser.id);
      return savedUser;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> { // Fix: id is string
    const existingUser = await this.userRepository.findOne({ where: { id } }); // Fix: id is string
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.findByEmail(updateUserDto.email);
      if (emailExists) {
        throw new ConflictException('Email sudah digunakan');
      }
    }
    // Handle username update conflict
    if (updateUserDto.username && updateUserDto.username !== existingUser.username) {
        const usernameExists = await this.findByUsername(updateUserDto.username);
        if (usernameExists) {
            throw new ConflictException('Username sudah digunakan');
        }
    }

    // Use preload for partial updates on existing entity
    const userToUpdate = await this.userRepository.preload({ id, ...updateUserDto }); // Fix: id is string
    if (!userToUpdate) { // Should not happen if existingUser was found
      throw new NotFoundException(`User with ID ${id} not found after preload`);
    }
    const updatedUser = await this.userRepository.save(userToUpdate);
    return new UserResponseDto(updatedUser); // Return DTO
  }

  async remove(id: string): Promise<{ message: string }> { // Fix: id is string
    const user = await this.userRepository.findOne({ where: { id } }); // Fix: id is string
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id); // Fix: id is string
    return { message: `User ${user.full_name || user.username} berhasil dihapus` }; // Fix: use full_name or username
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> { // Fix: id is string
    const user = await this.userRepository.findOne({ where: { id } }); // Fix: id is string
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!user.password_hash) { // Fix: use password_hash
      throw new ConflictException('User tidak memiliki password lokal. Gunakan Google login.');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password_hash, // Fix: use password_hash
    );
    if (!isCurrentPasswordValid) {
      throw new ConflictException('Password saat ini salah');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.userRepository.update(id, { password_hash: hashedNewPassword }); // Fix: use password_hash
    return { message: 'Password berhasil diubah' };
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: [
        'id', 'username', 'email', 'password_hash', 'full_name', 'profilePicture', 'googleId',
        'created_at', 'updated_at',
      ], // Fix: use correct property names (password_hash, full_name, created_at, updated_at)
    });
  }
}