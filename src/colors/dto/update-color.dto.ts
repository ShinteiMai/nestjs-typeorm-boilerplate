import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';

export class UpdateColorDto {
  @ApiProperty()
  @IsOptional()
  @Length(1)
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @Length(1)
  readonly hex: string;
}
