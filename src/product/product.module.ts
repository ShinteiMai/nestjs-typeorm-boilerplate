import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from 'src/colors/color.entity';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductImage } from './entities/productImage.entity';
import { ProductViews } from './entities/productViews.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProductViews,
      Color,
      User,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
