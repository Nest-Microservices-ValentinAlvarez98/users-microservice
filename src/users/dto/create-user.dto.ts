import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { CreateProfileDto } from "./create-profile.dto";


export class CreateUserDto extends CreateProfileDto {

      @IsString()
      @MinLength(3)
      @MaxLength(50)
      @IsEmail()
      email: string;

      @IsString()
      @MinLength(8)
      @MaxLength(50)
      password: string;

}