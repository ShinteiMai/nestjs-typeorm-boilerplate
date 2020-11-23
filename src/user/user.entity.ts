import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ProductViews } from 'src/product/entities/productViews.entity';

@Entity()
@Unique(['email'])
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true })
  googleId: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @ApiProperty()
  @OneToMany(
    () => ProductViews,
    productViews => productViews.user,
  )
  viewedProducts: ProductViews[];

  @ApiProperty()
  @CreateDateColumn()
  createdDate: string;

  @ApiProperty()
  @UpdateDateColumn()
  updateddate: string;
}
