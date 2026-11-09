import { IsNotEmpty, IsString, Matches, MinLength, Validate } from 'class-validator';
import { NIC_REGEX, NIC_REGEX_MESSAGE } from '@petlanka/types';
import { SriLankaAddressConstraint } from '../../../address/dto/address.dto';

export class RegisterClientDto {
  @IsString()
  @MinLength(2)
  declare fullName: string;

  @Matches(NIC_REGEX, { message: NIC_REGEX_MESSAGE })
  declare nic: string;

  @IsString()
  @IsNotEmpty()
  declare province: string;

  @IsString()
  @IsNotEmpty()
  declare district: string;

  @IsString()
  @IsNotEmpty()
  @Validate(SriLankaAddressConstraint)
  declare city: string;

  @IsString()
  @IsNotEmpty()
  declare streetAddress: string;
}
