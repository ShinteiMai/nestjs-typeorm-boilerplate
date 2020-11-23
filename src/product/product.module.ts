import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from 'src/colors/color.entity';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductImage } from './productImage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, Color]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
