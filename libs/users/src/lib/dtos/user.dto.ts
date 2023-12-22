import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class SignInUserDto {

  @ApiProperty()
  @IsNotEmpty()
  public username: string;

  @ApiProperty()
  @IsNotEmpty()
  public password: string;

}

export class CreateUserDto extends SignInUserDto {

  @ApiProperty()
  public _id: string;
  
  @ApiProperty()
  @IsNotEmpty()
  public fullName: string;

  @ApiProperty()
  public refreshToken?: string;

  @ApiProperty()
  public role?: string;

}

export class UpdateUserDto {
  fullName?: string;
  username?: string;
  password?: string;
  refreshToken?: string;
}