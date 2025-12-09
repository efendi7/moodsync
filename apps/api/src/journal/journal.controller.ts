// src/modules/journal/journal.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JournalService } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { QueryJournalDto } from './dto/query-journal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Journal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('journal-entries')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new journal entry' })
  @ApiResponse({
    status: 201,
    description: 'Journal entry created successfully',
  })
  async create(@Req() req, @Body() createDto: CreateJournalDto) {
    const userId = req.user.id;
    const data = await this.journalService.create(userId, createDto);

    return {
      success: true,
      message: 'Journal entry created successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all journal entries with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Journal entries retrieved successfully',
  })
  async findAll(@Req() req, @Query() queryDto: QueryJournalDto) {
    const userId = req.user.id;
    return await this.journalService.findAll(userId, queryDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get journal statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics(@Req() req, @Query('days') days?: number) {
    const userId = req.user.id;
    const data = await this.journalService.getStatistics(userId, days || 30);

    return {
      success: true,
      data,
    };
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent journal entries' })
  @ApiResponse({
    status: 200,
    description: 'Recent entries retrieved successfully',
  })
  async getRecentEntries(@Req() req, @Query('days') days?: number) {
    const userId = req.user.id;
    const data = await this.journalService.getRecentEntries(userId, days || 7);

    return {
      success: true,
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single journal entry' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Journal entry not found' })
  async findOne(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    const data = await this.journalService.findOne(id, userId);

    return {
      success: true,
      data,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a journal entry' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Journal entry not found' })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateJournalDto,
  ) {
    const userId = req.user.id;
    const data = await this.journalService.update(id, userId, updateDto);

    return {
      success: true,
      message: 'Journal entry updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a journal entry' })
  @ApiResponse({
    status: 200,
    description: 'Journal entry deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Journal entry not found' })
  async remove(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    await this.journalService.remove(id, userId);

    return {
      success: true,
      message: 'Journal entry deleted successfully',
    };
  }
}
