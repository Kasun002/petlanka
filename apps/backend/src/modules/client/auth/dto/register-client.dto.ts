import { IsNotEmpty, IsString, Matches, MinLength, Validate } from 'class-validator';
import { SriLankaAddressConstraint } from '../../../address/dto/address.dto';

export class RegisterClientDto {
  @IsString()
  @MinLength(2)
  declare fullName: string;

  @Matches(/^(\d{9}[VXvx]|\d{12})$/, { message: 'invalid NIC format' })
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
