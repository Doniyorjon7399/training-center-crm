import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { edu_token } = request.cookies;
    if (!edu_token) throw new UnauthorizedException('token invalid');
    const { user_id } = await this.jwt.verifyAsync(edu_token);
    const user = await this.prisma.teachers.findUnique({
      where: {
        id: user_id,
      },
    });
    if (!user) throw new UnauthorizedException('user not found');
    if (user.role !== 'admin') throw new ForbiddenException('not permission');
    return true;
  }
}
