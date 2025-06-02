import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email', 'createdAt'], // Exclude password
    });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'createdAt'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async create(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    try {
      console.log('🔍 Creating user with data:', {
        ...userData,
        password: '[HIDDEN]',
      });

      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Create new user
      const user = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(user);

      console.log('✅ User saved successfully with ID:', savedUser.id);

      // Return user without password
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    const result = await this.userRepository.update(id, updateData);
    if ((result.affected ?? 0) === 0) return null; // aman jika null/undefined
    return await this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return (result.affected ?? 0) > 0; // aman jika null/undefined
  }
}
