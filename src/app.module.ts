import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { AdminModule } from './modules/admin/admin.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import config from './config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: config,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: (configService: ConfigService) => {
        return configService.get('jwt_config') as JwtModuleAsyncOptions;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    TeacherModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
