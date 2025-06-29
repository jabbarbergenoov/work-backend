import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SlugdatasService } from './slugdatas.service';
import { CreateSlugdataDto } from './dto/create-slugdata.dto';
import { UpdateSlugdataDto } from './dto/update-slugdata.dto';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('slugdatas')
export class SlugdatasController {
  constructor(private readonly slugdatasService: SlugdatasService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  })) async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    const parsed: CreateSlugdataDto = {
      ...body,
      image: file?.filename ?? '',
      organish: JSON.parse(body.organish),
      modules: JSON.parse(body.modules),
    };

    return this.slugdatasService.create(parsed);
  }


  @Get()
  findAll(@Query("slugData") slugData: string) {
    return this.slugdatasService.findAll(slugData);
  }


  @Patch(':slug')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        }
      })
    })
  )
  async update(
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateSlugdataDto: UpdateSlugdataDto
  ) {
    if (file) {
      updateSlugdataDto.image = `/uploads/${file.filename}`;
    }
    return this.slugdatasService.updateByCourseSlug(slug, updateSlugdataDto);
  }


}
