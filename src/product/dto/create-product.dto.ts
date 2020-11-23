import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  Length,
  ValidateNested,
} from 'class-validator';
import { ProductImageInterface } from '../interfaces/ProductImageInterface';

export class CreateProductDto {
  @ApiProperty()
  @Length(1)
  name: string;

  @ApiProperty()
  @Length(1)
  material: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  productImages: ProductImageInterface[];

  @ApiProperty()
  @IsNotEmpty()
  width: number;

  @ApiProperty()
  @IsNotEmpty()
  height: number;

  @ApiProperty()
  @IsNotEmpty()
  depth: number;
}
