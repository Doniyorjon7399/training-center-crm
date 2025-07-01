import { OutStudent } from '@prisma/client';
import { IsString } from 'class-validator';

export class RemoveStudentDto {
  @IsString()
  studentId: string;
  @IsString()
  outStudent: OutStudent;
}
