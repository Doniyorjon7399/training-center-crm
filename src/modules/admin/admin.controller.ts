import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { createTeacherDto } from 'src/dtos/createTeacher.dto';
import { addGroupDto } from 'src/dtos/addGroupDto.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('add-teacher')
  async addTeacher(@Body() teacherDto: createTeacherDto) {
    try {
      return await this.adminService.addTeacher(teacherDto);
    } catch (error) {
      return { message: error.message };
    }
  }
  @Get('delete-teacher/:teacher_id')
  async deleteTeacher(@Param('teacher_id') teacherId: string) {
    try {
      return await this.adminService.deleteTeacher(teacherId);
    } catch (error) {
      return { message: error.message };
    }
  }
  @Post('addGroup')
  async addGroup(@Body() groupDto: addGroupDto) {
    try {
      return await this.adminService.addGroup(groupDto);
    } catch (error) {
      return { message: error.message };
    }
  }
}
