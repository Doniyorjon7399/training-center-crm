import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Request } from 'express';
import { IdDto } from 'src/dtos/id.dto';
import { AttendanceStatus } from '@prisma/client';
import { CreateStudentDto } from 'src/dtos/addStudent.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}
  @Get('my_groups')
  async myGroups(@Req() req: Request) {
    try {
      const token = req.cookies?.edu_token;
      return this.teacherService.myGroups(token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Get('group/:groupId/weekly')
  async getGroupWeeklyAttendance(@Param('groupId') groupId: string) {
    return await this.teacherService.getStudentWeaklyAll(groupId);
  }
  // @Get('group_students/:id')
  // async groupsStudents(@Param() id: IdDto) {
  //   try {
  //     return this.teacherService.groupsStudents(id.id);
  //   } catch (error) {
  //     return { message: error.message };
  //   }
  // }
  @Post('group/:groupId/today')
  async markTodayAttendance(
    @Param('groupId') groupId: string,
    @Body()
    body: { attendance: { studentId: string; status: AttendanceStatus }[] },
  ) {
    return await this.teacherService.markTodayAttendance(
      groupId,
      body.attendance,
    );
  }
  @Post('addStudents/:id')
  async addStudents(@Body() studentDto: CreateStudentDto, @Param() id: IdDto) {
    try {
      return this.teacherService.addStudent(id.id, studentDto);
    } catch (error) {
      return { message: error.message };
    }
  }
}
