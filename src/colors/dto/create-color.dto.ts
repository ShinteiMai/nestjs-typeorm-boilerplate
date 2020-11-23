import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateColorDto {
  @ApiProperty()
  @Length(1)
  readonly name: string;

  @ApiProperty()
  @Length(1)
  readonly hex: string;
}
