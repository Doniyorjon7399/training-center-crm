import { GroupStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ScheduleDto } from './schedula.dto';

export class addGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  teacherId: string; // O'qituvchining ID si

  @IsNotEmpty()
  @IsEnum(ScheduleDto) // Enum turini belgilash
  schedule: ScheduleDto;

  @IsNotEmpty()
  @IsEnum(GroupStatus) // Enum turini belgilash
  status: GroupStatus;

  @IsNotEmpty()
  @IsNumber()
  maxStudents: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: string; // Sanani string ko'rinishida qabul qilib, keyin Date ga o'tkazish mumkin

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
