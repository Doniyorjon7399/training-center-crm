import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { createTeacherDto } from 'src/dtos/createTeacher.dto';
import bcrypt from 'bcrypt';
import { CreateGroupDto } from 'src/dtos/addGroupDto.dto';
import { IdDto } from 'src/dtos/id.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  async addTeacher(data: createTeacherDto) {
    const { firstName, lastName, phone, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    const checkTeacher = await this.prisma.teachers.findUnique({
      where: {
        email,
      },
    });
    if (checkTeacher) throw new ConflictException('user all ready exists');
    const newTeacher = await this.prisma.teachers.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        password: hashPassword,
      },
    });
    return { success: true, data: newTeacher };
  }
  async deleteTeacher(id: string) {
    const FindUser = await this.prisma.teachers.findUnique({
      where: {
        id,
      },
    });
    if (!FindUser) throw new NotFoundException('Teacher not found');
    await this.prisma.teachers.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
    };
  }
  async addGroup(group: CreateGroupDto) {
    const cheskGroup = await this.prisma.group.findUnique({
      where: {
        name: group.name.trim(),
      },
    });
    if (cheskGroup) throw new ConflictException('group all ready create');
    const groups = await this.prisma.group.create({
      data: {
        name: group.name.trim(),
        subject: group.subject,
        teacher: {
          connect: { id: group.teacherId },
        },
        schedule: {
          days: group.schedule.days,
          startTime: group.schedule.startTime,
          endTime: group.schedule.endTime,
        },
        status: group.status,
        maxStudents: group.maxStudents,
        price: group.price,
        startDate: new Date(group.startDate),
        endDate: group.endDate ? new Date(group.endDate) : null,
      },
    });

    return groups;
  }
}
