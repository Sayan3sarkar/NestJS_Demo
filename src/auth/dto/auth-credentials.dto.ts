import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDTO {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
        message: 'Password too weak'
    })
    password: string;
}