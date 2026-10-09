import { IsEmail, IsMobilePhone, IsOptional, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @IsOptional()
  @Matches(/^(\d{9}[VXvx]|\d{12})$/, { message: 'invalid NIC format' })
  nic?: string;
}
