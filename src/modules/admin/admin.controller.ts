import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { createTeacherDto } from 'src/dtos/createTeacher.dto';
import { CreateGroupDto } from 'src/dtos/addGroupDto.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { IdDto } from 'src/dtos/id.dto';
import { CreateStudentDto } from 'src/dtos/addStudent.dto';
import { RemoveStudentDto } from 'src/dtos/removeStudent.dto';
import { group } from 'console';
import { RemoveGroupDto } from 'src/dtos/removeGroup.dto';
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
  @Post('addStudent/:id')
  async addStudents(@Body() studentDto: CreateStudentDto, @Param() id: IdDto) {
    try {
      return this.adminService.addStudent(id.id, studentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('removeStudent')
  async removeStudents(@Body() removeStudentDto: RemoveStudentDto) {
    try {
      return this.adminService.removeStudent(removeStudentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('removeGroup')
  async removeGroup(@Body() removeGroupDto: RemoveGroupDto) {
    try {
      return await this.adminService.removeGroup(removeGroupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('allGroups')
  async allGroups(@Query('page') page = '1', @Query('limit') limit = '10') {
    try {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      return await this.adminService.allGroups(pageNumber, limitNumber);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('allTeacher')
  async allTeacher(@Query('page') page = '1', @Query('limit') limit = '10') {
    try {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      return await this.adminService.allTeacher(pageNumber, limitNumber);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('allStudents')
  async allStudents(@Query('page') page = '1', @Query('limit') limit = '10') {
    try {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      return await this.adminService.allStudents(pageNumber, limitNumber);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('searchStudent')
  async getStudents(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    try {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      return this.adminService.getStudentsWithSearch(
        pageNumber,
        limitNumber,
        search,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
