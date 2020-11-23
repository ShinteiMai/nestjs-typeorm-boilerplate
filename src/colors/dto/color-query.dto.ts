import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ColorQueryDto {
  @ApiProperty()
  @IsOptional()
  limit: number;

  @ApiProperty()
  @IsOptional()
  name: string;
}
