import { IsNotEmpty, IsNumber } from 'class-validator';

export class CodeDto {
  @IsNotEmpty()
  @IsNumber()
  code: number;
}
