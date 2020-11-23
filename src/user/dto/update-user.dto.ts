import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @Length(1)
  readonly firstName: string;

  @ApiProperty()
  @IsOptional()
  @Length(1)
  readonly lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @Length(6)
  readonly oldPassword: string;

  @ApiProperty({ minLength: 6 })
  @IsOptional()
  @Length(6)
  readonly newPassword: string;

  @Length(1)
  @IsOptional()
  readonly googleId: string;
}
