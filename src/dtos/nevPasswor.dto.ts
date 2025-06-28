import { IsNotEmpty, IsString } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
