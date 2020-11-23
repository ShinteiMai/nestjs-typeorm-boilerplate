import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './productImage.entity';

@Entity()
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  material: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
  )
  @JoinColumn()
  productImages: ProductImage[];

  /** Dimensions of the product */
  @ApiProperty()
  @Column()
  width: number;

  @ApiProperty()
  @Column()
  height: number;

  @ApiProperty()
  @Column()
  depth: number;
}
