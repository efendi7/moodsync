// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // ParseIntPipe, // <-- HAPUS INI
  UseGuards,
  HttpCode, // Tambahkan HttpCode dan HttpStatus jika menggunakan status 204
  HttpStatus,
  ValidationPipe // Tambahkan ValidationPipe jika ingin divalidasi
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger'; // Tambahkan ApiParam, ApiBody
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard) // Protect all user endpoints
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  @ApiBody({ type: CreateUserDto }) // Tambahkan ApiBody untuk Swagger
  create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<UserResponseDto> { // Tambahkan ValidationPipe
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponseDto] })
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: 'string' }) // <-- PERBAIKAN: Tipe string di Swagger
  findOne(@Param('id') id: string): Promise<UserResponseDto> { // <-- PERBAIKAN: HAPUS ParseIntPipe, ID bertipe string
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: 'string' }) // <-- PERBAIKAN: Tipe string di Swagger
  @ApiBody({ type: UpdateUserDto }) // Tambahkan ApiBody untuk Swagger
  update(
    @Param('id') id: string, // <-- PERBAIKAN: HAPUS ParseIntPipe, ID bertipe string
    @Body(ValidationPipe) updateUserDto: UpdateUserDto, // Tambahkan ValidationPipe
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // <-- PERBAIKAN: Untuk respons 204
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' }) // <-- PERBAIKAN: Status 204
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: 'string' }) // <-- PERBAIKAN: Tipe string di Swagger
  remove(@Param('id') id: string): Promise<{ message: string }> { // <-- PERBAIKAN: HAPUS ParseIntPipe, ID bertipe string
    return this.usersService.remove(id);
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Current password is incorrect' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)', type: 'string' }) // <-- PERBAIKAN: Tipe string di Swagger
  @ApiBody({ type: ChangePasswordDto }) // Tambahkan ApiBody untuk Swagger
  changePassword(
    @Param('id') id: string, // <-- PERBAIKAN: HAPUS ParseIntPipe, ID bertipe string
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto, // Tambahkan ValidationPipe
  ): Promise<{ message: string }> {
    return this.usersService.changePassword(id, changePasswordDto);
  }
}