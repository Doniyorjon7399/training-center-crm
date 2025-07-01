import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { createTeacherDto } from 'src/dtos/createTeacher.dto';
import { CreateGroupDto } from 'src/dtos/addGroupDto.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { IdDto } from 'src/dtos/id.dto';
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('add-teacher')
  async addTeacher(@Body() teacherDto: createTeacherDto) {
    try {
      return await this.adminService.addTeacher(teacherDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('delete-teacher/:teacher_id')
  async deleteTeacher(@Param() param: IdDto) {
    try {
      return await this.adminService.deleteTeacher(param.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('addGroup')
  async addGroup(@Body() groupDto: CreateGroupDto) {
    try {
      return await this.adminService.addGroup(groupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
