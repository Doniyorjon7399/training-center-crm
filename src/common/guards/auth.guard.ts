import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { edu_token } = request.cookies;
    if (!edu_token) throw new UnauthorizedException('token invalid');
    try {
      await this.jwt.verifyAsync(edu_token);
    } catch (error) {
      throw new HttpException('token invalid', 401);
    }

    return true;
  }
}
