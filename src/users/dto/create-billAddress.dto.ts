import { IsString, Length } from "class-validator";


export class CreateBillAddressDto {

      @IsString()
      @Length(5, 50)
      state: string;

      @IsString()
      @Length(5, 50)
      city: string;

      @IsString()
      @Length(2, 10)
      zip_code: string;

      @IsString()
      @Length(5, 50)
      full_address: string;

}