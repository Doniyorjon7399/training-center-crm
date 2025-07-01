import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AttendanceStatus } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateStudentDto } from 'src/dtos/addStudent.dto';

@Injectable()
export class TeacherService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async myGroups(token: string) {
    const { user_id } = await this.jwt.verifyAsync(token);
    const teacher = await this.prisma.teachers.findUnique({
      where: {
        id: user_id,
      },
      include: {
        groups: true,
      },
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher.groups;
  }
  async getStudentWeaklyAll(groupId: string) {
    // Oxirgi 7 kun
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    // Sanalari tozalash (faqat yil-oy-kun)
    today.setHours(0, 0, 0, 0);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Guruh o'quvchilarini olish
    const groupStudents = await this.prisma.studentGroup.findMany({
      where: { groupId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            isActive: true,
          },
        },
      },
    });

    // Oxirgi 7 kunlik davomat
    const attendanceRecords = await this.prisma.attendance.findMany({
      where: {
        groupId,
        date: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
    });

    // 7 kunlik sanalar massivi
    const dates: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }

    // Har bir o'quvchi uchun 7 kunlik davomat ma'lumotlarini tuzish
    const studentsWithAttendance = groupStudents
      .filter((sg) => sg.student.isActive)
      .map((sg) => {
        const weeklyAttendance = dates.map((date) => {
          const attendance = attendanceRecords.find(
            (att) =>
              att.studentId === sg.student.id &&
              att.date.getTime() === date.getTime(),
          );
          return {
            date: date.toISOString().split('T')[0], // YYYY-MM-DD format
            status: attendance?.status || null,
          };
        });

        return {
          ...sg.student,
          weeklyAttendance,
        };
      });

    return studentsWithAttendance;
  }

  // async groupsStudents(id: string) {
  //   const studentGroups = await this.prisma.studentGroup.findMany({
  //     where: { groupId: id },
  //     include: {
  //       student: true,
  //     },
  //   });
  //   const students = studentGroups.map((sg) => sg.student);
  //   return students;
  // }
  async markTodayAttendance(
    groupId: string,
    attendanceList: { studentId: string; status: AttendanceStatus }[],
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const results = await Promise.all(
      attendanceList.map((item) =>
        this.prisma.attendance.upsert({
          where: {
            studentId_groupId_date: {
              studentId: item.studentId,
              groupId,
              date: today,
            },
          },
          update: {
            status: item.status,
          },
          create: {
            studentId: item.studentId,
            groupId,
            date: today,
            status: item.status,
          },
        }),
      ),
    );

    return results;
  }
  async addStudent(id: string, data: CreateStudentDto) {
    const { firstName, aboutAs, lastName, phone } = data;
    const student = this.prisma.student.create({
      data: {
        firstName,
        aboutAs,
        lastName,
        phone,
      },
    });
  }
}
