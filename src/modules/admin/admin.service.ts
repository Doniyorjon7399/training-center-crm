import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { createTeacherDto } from 'src/dtos/createTeacher.dto';
import bcrypt from 'bcrypt';
import { CreateGroupDto } from 'src/dtos/addGroupDto.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async addTeacher(data: createTeacherDto) {
    const { firstName, lastName, phone, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
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
    console.log(id);
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
    {
    }
    const user = await this.prisma.group.create({
      data: {
        name: group.name,
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
    return user;
  }
}
