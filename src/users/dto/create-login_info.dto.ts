import { IsEmail, IsString, Max, MaxLength, MinLength } from "class-validator";


export class CreateLogin_infoDto {

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
