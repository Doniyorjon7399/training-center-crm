import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PaymentsDto } from 'src/dtos/paymentDto';

@Injectable()
export class PaymetsService {
  constructor(private prisma: PrismaService) {}
  async addPayment(paymentDto: PaymentsDto) {
    const { amount, paymentMethod, status, studentId, groupId, note } =
      paymentDto;
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!student) throw new NotFoundException('student not found');
    const payment = await this.prisma.payment.create({
      data: {
        studentId,
        groupId,
        amount: +amount,
        paymentMethod,
        status,
        note,
        paymentDate: new Date(),
      },
    });
    return payment;
  }
}
