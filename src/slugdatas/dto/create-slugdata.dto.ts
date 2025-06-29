import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ModuleDto {
    @IsString()
    id: string;

    @IsString()
    title: string;
}

export class CreateSlugdataDto {
    @IsString()
    name: string;

    @IsString()
    description: string;
    
    @IsString()
    slug: string;

    @IsString()
    image: string;

    @IsString()
    dars: string;

    @IsArray()
    @IsString({ each: true })
    organish: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ModuleDto)
    modules: ModuleDto[];
}
