import { PartialType } from '@nestjs/mapped-types';
import { CreateSlugdataDto } from './create-slugdata.dto';
import { IsArray, IsOptional, IsString, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ModuleDto {
    @IsString()
    id: string;

    @IsString()
    title: string;
}

export class UpdateSlugdataDto extends PartialType(CreateSlugdataDto) {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    dars?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsNumber()
    coursesId?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    organish?: string[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ModuleDto)
    modules?: ModuleDto[];
}
