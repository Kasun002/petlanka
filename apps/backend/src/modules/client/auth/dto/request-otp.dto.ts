import { IsEmail, IsMobilePhone, IsOptional, Matches } from 'class-validator';
import { NIC_REGEX, NIC_REGEX_MESSAGE } from '@petlanka/types';

export class RequestOtpDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;

  @IsOptional()
  @Matches(NIC_REGEX, { message: NIC_REGEX_MESSAGE })
  nic?: string;
}
