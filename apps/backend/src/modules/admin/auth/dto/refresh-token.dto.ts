import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  declare refreshToken: string;
}
