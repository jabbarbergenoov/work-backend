import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import slugify from 'slugify';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCourseDto: CreateCourseDto, file: Express.Multer.File) {
    try {
      const normalizedName = createCourseDto.name.trim();

      const courseExisting = await this.prisma.courses.findFirst({
        where: {
          name: normalizedName,
        },
      });

      if (courseExisting) {
        throw new BadRequestException('Bunday kurs allaqachon mavjud');
      }

      const slug = slugify(normalizedName, { lower: true });

      const course = await this.prisma.courses.create({
        data: {
          name: normalizedName,
          image: `/uploads/${file.filename}`, // 👈 Файл от multer
          slug,
        },
      });

      return {
        message: 'Kurs muvaffaqiyatli yaratildi',
        course,
      };
    } catch (error) {
      throw new BadRequestException('Kurs yaratishda xatolik yuz berdi');
    }
  }


  findAll() {
    return this.prisma.courses.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        slug: true,
      },
    })
  }


  async update(id: number, updateCourseDto: UpdateCourseDto, file?: Express.Multer.File) {
    try {
      const course = await this.prisma.courses.findUnique({ where: { id } });

      if (!course) {
        throw new NotFoundException('Kurs topilmadi');
      }

      const normalizedName = updateCourseDto.name.trim();

      // Опционально: проверка, есть ли уже курс с таким именем (и другим id)
      const sameNameCourse = await this.prisma.courses.findFirst({
        where: {
          name: normalizedName,
          NOT: { id },
        },
      });

      if (sameNameCourse) {
        throw new BadRequestException('Bunday nomdagi kurs allaqachon mavjud');
      }

      const updated = await this.prisma.courses.update({
        where: { id },
        data: {
          name: normalizedName,
          slug: slugify(normalizedName, { lower: true }),
          image: file ? `/uploads/${file.filename}` : course.image, // ← заменить если файл есть
        },
      });

      return {
        message: "Kurs muvaffaqiyatli yangilandi",
        course: updated,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException("Kursni yangilashda xatolik yuz berdi");
    }
  }

  async remove(id: number) {
    try {
      const course = await this.prisma.courses.findUnique({
        where: { id },
      });

      if (!course) {
        throw new NotFoundException('Bunday kurs topilmadi');
      }

      await this.prisma.courses.delete({
        where: { id },
      });

      return {
        message: "Kurs muvaffaqiyatli o'chirildi",
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('❌ Xatolik kursni o‘chirishda:', error);
      throw new BadRequestException("Kursni o'chirishda xatolik yuz berdi");
    }
  }

}
