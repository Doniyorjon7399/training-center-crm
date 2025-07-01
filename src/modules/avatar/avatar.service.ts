import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AvatarService {
  constructor(private prisma: PrismaService) {}
  async updateTeacherAvatar(teacherId: string, avatarPath: string) {
    const existingTeacher = await this.prisma.teachers.findUnique({
      where: { id: teacherId },
    });

    if (!existingTeacher)
      throw new NotFoundException(
        `ID ${teacherId} bilan o'qituvchi topilmadi.`,
      );

    return this.prisma.teachers.update({
      where: { id: teacherId },
      data: { avatar: avatarPath },
    });
  }
  async findOne(id: string) {
    return this.prisma.teachers.findUnique({ where: { id } });
  }
}
