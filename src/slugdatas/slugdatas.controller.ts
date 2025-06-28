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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createSlugdataDto: CreateSlugdataDto
  ) {
    // Обработка данных формы и файла
    return this.slugdatasService.create({
      ...createSlugdataDto,
      image: file.filename, // Сохраняем имя файла
    });
  }

  @Get()
  findAll(@Query("slugData") slugData: string) {
    return this.slugdatasService.findAll(slugData);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slugdatasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSlugdataDto: UpdateSlugdataDto) {
    return this.slugdatasService.update(+id, updateSlugdataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slugdatasService.remove(+id);
  }
}
