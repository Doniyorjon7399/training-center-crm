import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}
  private admin_firstName: string = process.env.SUPER_ADMIN_FIRSTNAME as string;
  private admin_lastName: string = process.env.SUPER_ADMIN_LASTNAME as string;
  private admin_password: string = process.env.SUPER_ADMIN_PASSWORD as string;
  private admin_email: string = process.env.SUPER_ADMIN_EMAIL as string;
  private admin_phone: string = process.env.SUPER_ADMIN_PHONE as string;
  async onModuleInit() {
    try {
      const admin = await this.prisma.teachers.findUnique({
        where: {
          email: this.admin_email,
        },
      });
      if (!admin) {
        const passwordHash = await bcrypt.hash(this.admin_password, 10);
        await this.prisma.teachers.create({
          data: {
            firstName: this.admin_firstName,
            lastName: this.admin_lastName,
            password: passwordHash,
            email: this.admin_email,
            phone: this.admin_phone,
            role: Role.admin,
          },
        });
        console.log('✅ Super admin successfully created.');
      } else {
        console.log('ℹ️  Super admin already exists.');
      }
    } catch (error) {
      console.error('❌ Error while seeding super admin:', error);
    }
  }
}
