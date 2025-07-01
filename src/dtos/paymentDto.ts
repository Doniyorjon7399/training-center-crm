import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class PaymentsDto {
  @IsString()
  groupId: string;
  @IsString()
  studentId: string;
  @IsNumber()
  amount: string;
  @IsString()
  paymentMethod: PaymentMethod;
  @IsString()
  status: PaymentStatus;
  @IsString()
  note?: string;
}
