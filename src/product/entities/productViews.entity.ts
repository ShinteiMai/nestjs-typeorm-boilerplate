import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductViews {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Product,
    product => product.views,
  )
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  productId: string;

  @ManyToOne(
    () => User,
    user => user.viewedProducts,
  )
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;
}
