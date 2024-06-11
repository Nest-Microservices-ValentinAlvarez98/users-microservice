import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateProfileDto {

      @IsString()
      @MinLength(3)
      @MaxLength(50)
      first_name: string;

      @IsString()
      @MinLength(3)
      @MaxLength(50)
      last_name: string;

      @IsOptional()
      @IsString()
      @MinLength(3)
      @MaxLength(50)
      display_name?: string;

      @IsString()
      @MinLength(8)
      @MaxLength(13)
      phone: string;

}