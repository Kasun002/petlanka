import { IsEmail, IsMobilePhone, IsOptional, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsOptional()
  @IsEmail()
  declare email?: string;

  @IsOptional()
  @IsMobilePhone()
  declare phone?: string;

  @IsString()
  @Length(6, 6)
  declare code: string;
}
