import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}
  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/(image\/(jpeg|png|gif))/)) {
          return cb(
            new BadRequestException(
              'Faqat rasm fayllariga (JPEG, PNG, GIF) ruxsat beriladi.',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @Param('id') teacherId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Fayl yuklanmadi.');
    }
    const avatarPath = `/public/uploads/${file.filename}`;
    const updatedTeacher = await this.avatarService.updateTeacherAvatar(
      teacherId,
      avatarPath,
    );

    return {
      message: 'Avatar muvaffaqiyatli yuklandi va yangilandi!',
      teacher: updatedTeacher,
      avatarUrl: avatarPath,
    };
  }
}
