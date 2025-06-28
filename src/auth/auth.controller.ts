import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) { }

  @Post('/register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('/refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    console.log('🔄 Refresh token:', refreshToken);
    return this.authService.refresh(refreshToken);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {

  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    const googleUser = req.user;

    const jwt = await this.authService.validateGoogleUser(googleUser);

    const query = new URLSearchParams({
      accessToken: jwt.accessToken,
      refreshToken: jwt.refreshToken,
    }).toString();

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?${query}`);
  }

}
