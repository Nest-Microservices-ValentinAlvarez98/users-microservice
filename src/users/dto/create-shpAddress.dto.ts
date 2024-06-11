import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateShpAddressDto {

      @IsString()
      @MinLength(5)
      @MaxLength(50)
      state: string;

      @IsString()
      @MinLength(5)
      @MaxLength(50)
      city: string;

      @IsString()
      @MinLength(5)
      @MaxLength(50)
      location: string;

      @IsString()
      @MinLength(5)
      @MaxLength(50)
      street_name: string;

      @IsString()
      @MinLength(3)
      @MaxLength(20)
      street_number: string;

      @IsString()
      @MinLength(3)
      @MaxLength(10)
      zip_code: string;

      @IsString()
      @MinLength(8)
      @MaxLength(13)
      contact_phone: string;

      @IsString()
      @MinLength(3)
      @MaxLength(50)
      contact_name: string;

      @IsOptional()
      @IsString()
      @MinLength(5)
      @MaxLength(100)
      commentary?: string;



}