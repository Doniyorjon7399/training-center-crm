import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import bcrypt from 'bcrypt';
import { LoginDto } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailDto } from 'src/dtos/email.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/utils/mail.service.ts';
import Redis from 'ioredis';
import { CodeDto } from 'src/dtos/code.dto';
import { NewPasswordDto } from 'src/dtos/nevPasswor.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailService: MailService,
    private jwt: JwtService,
  ) {}
  async login(data: LoginDto) {
    const { email, password } = data;
    const user = await this.prisma.teachers.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) throw new UnauthorizedException('invalid password');
    const token = this.jwtService.sign({ user_id: user.id });
    return {
      token,
      success: true,
      data: user,
      message: 'user login success',
    };
  }
  async forgotPassword(email: EmailDto) {
    const chescUser = await this.prisma.teachers.findUnique({
      where: {
        email: email.email,
      },
    });
    if (!chescUser) throw new NotFoundException('email not found');
    const token = this.jwtService.sign(
      { user_id: chescUser.id },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: '10m' },
    );
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.mailService.sendMail(email.email, resetCode);
    const expiresIn = 10 * 60;
    try {
      await this.redisClient.setex(chescUser.id, expiresIn, resetCode);
    } catch (error) {
      throw new BadRequestException('Kodni saqlashda xato yuz berdi.');
    }

    return {
      token,
      success: true,
      message: 'send pinCode, check your email',
    };
  }
  async forgotPasswordPin(code: CodeDto, token: string) {
    if (!token) throw new UnauthorizedException('token invalid');
    const { user_id } = await this.jwt.verifyAsync(token);
    try {
      const storedCode = await this.redisClient.get(user_id);

      if (!storedCode) {
        throw new UnauthorizedException("Kod muddati tugagan yoki noto'g'ri.");
      }

      if (storedCode === String(code.code)) {
        await this.redisClient.del(user_id);
        return {
          success: true,
        };
      } else {
        throw new UnauthorizedException('Notogri tasdiqlash kodi');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Kodni tekshirishda xato yuz berdi.');
    }
  }
  async newPassword(password: NewPasswordDto, token: string) {
    if (!token) throw new UnauthorizedException('token invalid');
    const { user_id } = await this.jwt.verifyAsync(token);
    const user = await this.prisma.teachers.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!user) throw new NotFoundException('user not found');

    const hasPassword = await bcrypt.hash(password.password, 10);
    const updateUser = await this.prisma.teachers.update({
      where: {
        id: user_id,
      },
      data: {
        password: hasPassword,
      },
    });
    return {
      success: true,
      data: updateUser,
    };
  }
}
