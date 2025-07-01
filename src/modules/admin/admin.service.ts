import {
  BadRequestException,
  ConflictException,
  Get,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { createTeacherDto } from 'src/dtos/createTeacher.dto';
import bcrypt from 'bcrypt';
import { CreateGroupDto } from 'src/dtos/addGroupDto.dto';
import { IdDto } from 'src/dtos/id.dto';
import { CreateStudentDto } from 'src/dtos/addStudent.dto';
import { RemoveStudentDto } from 'src/dtos/removeStudent.dto';
import { RemoveGroupDto } from 'src/dtos/removeGroup.dto';
import { Prisma } from '@prisma/client';

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
  async addStudent(groupId: string, data: CreateStudentDto) {
    const { firstName, aboutAs, lastName, phone } = data;
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        studentGroups: true,
      },
    });

    if (!group) {
      throw new NotFoundException('group not found');
    }
    const student = await this.prisma.student.findUnique({
      where: {
        phone: phone.trim(),
      },
    });
    if (student) throw new ConflictException('user already existed');
    const user = await this.prisma.student.create({
      data: {
        firstName,
        lastName,
        phone,
        aboutAs,
      },
    });

    const existingRelation = await this.prisma.studentGroup.findFirst({
      where: {
        studentId: user.id,
        groupId,
      },
    });

    if (existingRelation) {
      throw new BadRequestException("O'quvchi allaqachon ushbu guruhda mavjud");
    }
    const currentStudentsCount = group.studentGroups.length;
    if (currentStudentsCount >= group.maxStudents) {
      throw new BadRequestException(
        "Guruhda joy yo'q. Maksimal o'quvchilar soni: " + group.maxStudents,
      );
    }
    const studentGroup = await this.prisma.studentGroup.create({
      data: {
        studentId: user.id,
        groupId,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
      },
    });

    return {
      message: 'student add success',
      studentGroup,
    };
  }
  async removeStudent(removeStudentDto: RemoveStudentDto) {
    const { studentId, outStudent } = removeStudentDto;
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    await this.prisma.student.update({
      where: { id: studentId },
      data: {
        outStudent,
        isActive: false,
      },
    });
    return { message: `outStudent:${outStudent}` };
  }
  async removeGroup(removeGroupDto: RemoveGroupDto) {
    const { groupId, status } = removeGroupDto;
    const group = await this.prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });
    if (!group) throw new NotFoundException('group not found');
    await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        status,
      },
    });
    return {
      message: `group ${status}`,
    };
  }
  async allGroups(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [groups, total] = await this.prisma.$transaction([
      this.prisma.group.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: true,
          studentGroups: {
            include: {
              student: true,
            },
          },
        },
      }),
      this.prisma.group.count(),
    ]);

    return {
      data: groups,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async allTeacher(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [teachers, total] = await this.prisma.$transaction([
      this.prisma.teachers.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          groups: true,
        },
      }),
      this.prisma.teachers.count(),
    ]);

    return {
      data: teachers,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async allStudents(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [students, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          studentGroups: {
            include: {
              group: true,
            },
          },
          payments: true,
        },
      }),
      this.prisma.student.count(),
    ]);

    return {
      data: students,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async getStudentsWithSearch(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.StudentWhereInput = search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              lastName: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const [students, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        skip,
        take: limit,
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        include: {
          studentGroups: {
            include: {
              group: true,
            },
          },
          payments: true,
        },
      }),
      this.prisma.student.count({ where: whereCondition }),
    ]);
    if (students.length == 0) throw new NotFoundException('not found');
    return {
      data: students,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
