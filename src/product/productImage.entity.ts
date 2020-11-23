import { ApiProperty } from '@nestjs/swagger';
import { Color } from 'src/colors/color.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(() => Color)
  color: Color;

  @ApiProperty()
  @ManyToOne(
    () => Product,
    product => product.productImages,
  )
  product: Product;

  @ApiProperty()
  @Column()
  imageUrl: string;
}
