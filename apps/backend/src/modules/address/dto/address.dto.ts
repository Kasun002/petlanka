import { IsNotEmpty, IsString, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import provinces from '../data/provinces.json';
import districts from '../data/districts.json';
import cities from '../data/cities.json';

@ValidatorConstraint({ name: 'sriLankaAddress', async: false })
export class SriLankaAddressConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const obj = args.object as AddressDto;
    const province = provinces.find((p) => p.name_en === obj.province);
    if (!province) return false;
    const district = districts.find((d) => d.name_en === obj.district && d.province_id === province.id);
    if (!district) return false;
    return cities.some((c) => c.name_en === obj.city && c.district_id === district.id);
  }

  defaultMessage(): string {
    return 'province, district, and city must be a valid Sri Lanka combination';
  }
}

export class AddressDto {
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
