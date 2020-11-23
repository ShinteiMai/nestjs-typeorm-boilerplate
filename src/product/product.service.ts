import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from 'src/colors/color.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto';
import { Product } from './product.entity';
import { ProductImage } from './productImage.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          productImages: 'product.productImages',
          color: 'productImages.color',
        },
      },
    });
  }

  async findById(id: string): Promise<Product> {
    return await this.productRepository.findOne(id, {
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          productImages: 'product.productImages',
          color: 'productImages.color',
        },
      },
    });
  }

  async findByName(name: string): Promise<Product> {
    return await this.productRepository.findOne(
      { name },
      {
        join: {
          alias: 'product',
          leftJoinAndSelect: {
            productImages: 'product.productImages',
            color: 'productImages.color',
          },
        },
      },
    );
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = data.name;
    product.material = data.material;
    product.price = data.price;

    product.width = data.width;
    product.height = data.height;
    product.depth = data.depth;

    const images: ProductImage[] = [];
    for await (const d of data.productImages) {
      const productImage = new ProductImage();
      productImage.imageUrl = d.imageUrl;
      productImage.color = await this.colorRepository.findOne(d.colorId);
      if (!productImage.color) {
        throw new NotFoundException(
          `Color with the id of ${d.colorId} was not found`,
        );
      }
      try {
        const p = await this.productImageRepository.save(productImage);
        images.push(p);
      } catch (err) {
        throw new BadRequestException(err);
      }
    }
    product.productImages = images;
    try {
      return await this.productRepository.save(product);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
