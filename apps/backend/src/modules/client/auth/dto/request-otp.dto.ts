import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';

export class RequestOtpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;
}
