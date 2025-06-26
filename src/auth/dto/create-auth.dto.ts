// create-auth.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    firstName?: string;

    @IsOptional()
    lastName?: string;
}
