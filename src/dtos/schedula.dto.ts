// src/common/dto/schedule.dto.ts
import { IsArray, IsString, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class ScheduleDto {
  @IsArray()
  @IsString({ each: true }) // Arraydagi har bir element string ekanligini tekshiradi
  @ArrayMinSize(1) // Kamida bitta kun bo'lishi kerak
  @IsNotEmpty({ each: true }) // Har bir kun bo'sh bo'lmasligi kerak
  days: string[];

  @IsNotEmpty()
  @IsString()
  // Vaqt formati uchun qo'shimcha validatsiya ham qo'shishingiz mumkin, masalan: @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @IsNotEmpty()
  @IsString()
  // Vaqt formati uchun qo'shimcha validatsiya
  endTime: string;
}
