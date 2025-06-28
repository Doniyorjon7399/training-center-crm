import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dtos/login.dto';
import { Response } from 'express';
import { EmailDto } from 'src/dtos/email.dto';
import { CodeDto } from 'src/dtos/code.dto';
import { NewPasswordDto } from 'src/dtos/nevPasswor.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('edu_token');
    const user = await this.authService.login(loginDto);
    res.cookie('edu_token', user.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return user;
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('edu_token');
    return { message: 'Successfully logged out' };
  }
  @Post('forgot-password')
  async forgotPassword(
    @Body() emailDto: EmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('edu_token');
    const data = await this.authService.forgotPassword(emailDto);
    res.cookie('edu_token', data.token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return data;
  }
  @Post('forgot-password/pin')
  async forgotPasswordPin(@Body() code: CodeDto, @Req() req: any) {
    try {
      const token = req.cookies?.edu_token;
      return await this.authService.forgotPasswordPin(code, token);
    } catch (error) {
      return { message: error };
    }
  }
  @Post('new-password')
  async newPassword(@Body() password: NewPasswordDto, @Req() req: any) {
    try {
      const token = req.cookies?.edu_token;
      return await this.authService.newPassword(password, token);
    } catch (error) {
      return { error: error.message };
    }
  }
}
