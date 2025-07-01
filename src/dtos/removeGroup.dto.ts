import { GroupStatus } from '@prisma/client';
import { IsString } from 'class-validator';

export class RemoveGroupDto {
  @IsString()
  groupId: string;
  @IsString()
  status: GroupStatus;
}
