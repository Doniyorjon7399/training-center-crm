import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { MailModule } from 'src/utils/mail.module';
import Redis from 'ioredis';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [MailerModule, ConfigModule, MailModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {}
