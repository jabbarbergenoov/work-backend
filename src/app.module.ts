import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule], // ✅ Только импортируем AuthModule
})
export class AppModule { }
