import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { ProductImageInterface } from '../interfaces/ProductImageInterface';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @Length(1)
  name: string;

  @ApiProperty()
  @IsOptional()
  @Length(1)
  material: string;

  @ApiProperty()
  @IsOptional()
  @Length(1)
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  productImages: ProductImageInterface[];

  @ApiProperty()
  @IsOptional()
  @Length(1)
  width: number;

  @ApiProperty()
  @IsOptional()
  @Length(1)
  height: number;

  @ApiProperty()
  @IsOptional()
  @Length(1)
  depth: number;
}
