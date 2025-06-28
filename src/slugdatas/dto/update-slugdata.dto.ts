import { PartialType } from '@nestjs/mapped-types';
import { CreateSlugdataDto } from './create-slugdata.dto';

export class UpdateSlugdataDto extends PartialType(CreateSlugdataDto) {}
