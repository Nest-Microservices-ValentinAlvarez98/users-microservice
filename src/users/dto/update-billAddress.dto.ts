import { PartialType } from "@nestjs/mapped-types";
import { CreateBillAddressDto } from "./create-billAddress.dto";
import { IsBoolean, IsOptional } from "class-validator";


export class UpdateBillAddressDto extends PartialType(CreateBillAddressDto) {

      @IsOptional()
      @IsBoolean()
      is_available: boolean;

}