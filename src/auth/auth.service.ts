import { Injectable, ConflictException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) { }
  async create(createAuthDto: CreateAuthDto) {
    const { email, firstName, lastName } = createAuthDto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email allaqachon ro‘yxatdan o‘tgan');
    }

    const user = await this.prismaService.user.create({
      data: { email, firstName, lastName },
    });

    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      message: 'Foydalanuvchi muvaffaqiyatli yaratildi',
      accessToken,
      refreshToken,
      user,
    };
  }


  async login(loginAuthDto: LoginAuthDto) {
    const { email } = loginAuthDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ConflictException('Foydalanuvchi topilmadi');
    }

    // 🔐 Генерация JWT токенов
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      message: 'Foydalanuvchi muvaffaqiyatli tizimga kirdi',
      accessToken,
      refreshToken,
      user,
    };
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new ConflictException('Foydalanuvchi topilmadi');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '15m' },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '7d' },
      );

      return {
        message: 'Tokenlar muvaffaqiyatli yangilandi',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      throw new ConflictException('Noto‘g‘ri yoki eskirgan refresh token');
    }
  }
}
