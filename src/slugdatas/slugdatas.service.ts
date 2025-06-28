import { Slugdata } from './entities/slugdata.entity';
import { Injectable } from '@nestjs/common';
import { CreateSlugdataDto } from './dto/create-slugdata.dto';
import { UpdateSlugdataDto } from './dto/update-slugdata.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SlugdatasService {
  constructor(private readonly prisma: PrismaService) { }


  async create(createSlugdataDto: CreateSlugdataDto) {
    const { name, description, image, dars, organish, modules } = createSlugdataDto;

    const moduleEntities = await Promise.all(
      modules.map(async (mod) => {
        return this.prisma.module.upsert({
          where: { id: +mod.id },
          update: {},
          create: {
            title: mod.title,
          },
        });
      })
    );

    const newSlugdata = await this.prisma.slugdata.create({
      data: {
        name,
        description,
        image,
        module: dars,
        organish: {
          set: organish,
        },
      },
    });

    await Promise.all(
      moduleEntities.map((mod) => {
        return this.prisma.moduleOnSlugdata.create({
          data: {
            slugdataId: newSlugdata.id,
            moduleId: mod.id,
          },
        });
      })
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




  findOne(id: number) {
    return `This action returns a #${id} slugdata`;
  }

  update(id: number, updateSlugdataDto: UpdateSlugdataDto) {
    return `This action updates a #${id} slugdata`;
  }

  remove(id: number) {
    return `This action removes a #${id} slugdata`;
  }
}
