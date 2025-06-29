import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSlugdataDto } from './dto/create-slugdata.dto';
import { UpdateSlugdataDto } from './dto/update-slugdata.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SlugdatasService {
  constructor(private readonly prisma: PrismaService) { }


  async create(createSlugdataDto: CreateSlugdataDto) {
    const { name, description, dars, organish, modules, slug, image } = createSlugdataDto;

    // Найти курс по slug
    const course = await this.prisma.courses.findUnique({
      where: { slug },
    });

    if (!course) {
      throw new Error(`Курс со slug "${slug}" не найден`);
    }

    // Upsert модулей
    const moduleEntities = await Promise.all(
      modules.map((mod) =>
        this.prisma.module.upsert({
          where: { id: +mod.id },
          update: {},
          create: { title: mod.title },
        })
      )
    );

    // Создание Slugdata с привязкой к курсу
    const newSlugdata = await this.prisma.slugdata.create({
      data: {
        name,
        description,
        image,
        module: dars,
        organish: { set: organish },
        coursesId: course.id, // Привязка к курсу
      },
    });

    // Привязка модулей
    await Promise.all(
      moduleEntities.map((mod) =>
        this.prisma.moduleOnSlugdata.create({
          data: {
            slugdataId: newSlugdata.id,
            moduleId: mod.id,
          },
        })
      )
    );

    return newSlugdata;
  }


  async findAll(slug: string) {
    const course = await this.prisma.courses.findUnique({
      where: { slug },
      include: {
        Slugdata: {
          include: {
            modules: {
              include: {
                module: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new Error(`Курс со slug "${slug}" не найден`);
    }

    return course.Slugdata;
  }




  async updateByCourseSlug(slug: string, dto: UpdateSlugdataDto) {
    const course = await this.prisma.courses.findUnique({
      where: { slug },
      include: { Slugdata: true },
    });

    if (!course) throw new NotFoundException('Курс не найден');

    const slugdata = course.Slugdata[0];
    if (!slugdata) throw new NotFoundException('Связанная Slugdata не найдена');

    const data: any = {
      name: dto.name,
      description: dto.description,
      image: dto.image,
      module: dto.dars,
      organish: { set: dto.organish },
    };

    if (dto.slug) data.slug = dto.slug;
    if (dto.coursesId) data.coursesId = dto.coursesId;

    const updated = await this.prisma.slugdata.update({
      where: { id: slugdata.id },
      data,
    });


    if (dto.modules && dto.modules.length > 0) {
      await this.prisma.moduleOnSlugdata.deleteMany({
        where: { slugdataId: updated.id },
      });

      await this.prisma.moduleOnSlugdata.createMany({
        data: dto.modules.map((mod) => ({
          slugdataId: updated.id,
          moduleId: +mod.id,
        })),
      });
    }

    return updated;
  }




}
