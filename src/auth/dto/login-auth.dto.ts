// create-auth.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
