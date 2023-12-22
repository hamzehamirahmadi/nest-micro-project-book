import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PaidDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  petmentId: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  plan: number;
}