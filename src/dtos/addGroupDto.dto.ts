import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  ValidateNested, // <-- Bu muhim
} from 'class-validator';
import { Type } from 'class-transformer'; // <-- Bu ham muhim
import { GroupStatus } from '@prisma/client'; // Agar `GroupStatus` enum Prisma'dan kelsa

import { ScheduleDto } from './schedula.dto'; // <-- To'g'ri yo'l bilan import qiling

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  teacherId: string;

  @ValidateNested() // Bu `ScheduleDto` ichidagi validatsiyalar ishlatilishini ta'minlaydi
  @Type(() => ScheduleDto) // Bu JSON datani `ScheduleDto` instance'iga aylantiradi
  schedule: ScheduleDto; // <-- Tip to'g'ri

  @IsNotEmpty()
  @IsEnum(GroupStatus) // Agar `GroupStatus` enum bo'lsa
  status: GroupStatus;

  @IsNotEmpty()
  @IsNumber()
  maxStudents: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
