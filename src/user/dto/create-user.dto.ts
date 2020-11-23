import { IsEmail, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @Length(1)
  readonly firstName: string;

  @ApiProperty()
  @Length(1)
  readonly lastName: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ minLength: 6 })
  @Length(6)
  readonly password: string;

  @Length(1)
  @IsOptional()
  readonly googleId: string;
}
