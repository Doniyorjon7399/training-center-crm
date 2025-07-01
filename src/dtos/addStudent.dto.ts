// dto/create-student.dto.ts
import { About } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  aboutAs: About;
}
