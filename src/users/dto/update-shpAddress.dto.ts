import { PartialType } from "@nestjs/mapped-types";
import { CreateShpAddressDto } from "./create-shpAddress.dto";
import { IsBoolean, IsOptional } from "class-validator";


export class UpdateShpAddressDto extends PartialType(CreateShpAddressDto) {

      @IsOptional()
      @IsBoolean()
      is_available: boolean;

}