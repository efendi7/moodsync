import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpStatus, 
  NotFoundException, 
  Param, 
  ParseIntPipe, 
  Patch, 
  Post, 
  UseGuards 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity'; // import User dari entity
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // akan dibuat nanti

@Controller('users')
@UseGuards(JwtAuthGuard) // Protect all routes with JWT
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersService.findAll();
    return users.map(({ password, ...user }) => user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post()
  async create(@Body() createUserDto: {
    name: string;
    email: string;
    password: string;
  }): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new NotFoundException('Email already exists');
    }

    const newUser = await this.usersService.create(createUserDto);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: {
      name?: string;
      email?: string;
      password?: string;
    }
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email) {
      const userWithEmail = await this.usersService.findByEmail(updateUserDto.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new NotFoundException('Email already taken by another user');
      }
    }

    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string; statusCode: number }> {
    const success = await this.usersService.remove(id);
    if (!success) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      message: `User with ID ${id} has been deleted successfully`,
      statusCode: HttpStatus.OK,
    };
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
