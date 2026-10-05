import { IsString, MinLength } from 'class-validator';

export class RegisterClientDto {
  @IsString()
  @MinLength(1)
  declare firstName: string;

  @IsString()
  @MinLength(1)
  declare lastName: string;
}
