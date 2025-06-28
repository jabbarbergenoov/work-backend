import { Module } from '@nestjs/common';
import { SlugdatasService } from './slugdatas.service';
import { SlugdatasController } from './slugdatas.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SlugdatasController],
  providers: [SlugdatasService, PrismaService],
})
export class SlugdatasModule { }
