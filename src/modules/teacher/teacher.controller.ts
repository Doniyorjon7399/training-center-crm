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
import { AttendanceStatus } from '@prisma/client';

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
    try {
      return await this.teacherService.getStudentWeaklyAll(groupId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('group/:groupId/today')
  async markTodayAttendance(
    @Param('groupId') groupId: string,
    @Body()
    body: { attendance: { studentId: string; status: AttendanceStatus }[] },
  ) {
    try {
      return await this.teacherService.markTodayAttendance(
        groupId,
        body.attendance,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
