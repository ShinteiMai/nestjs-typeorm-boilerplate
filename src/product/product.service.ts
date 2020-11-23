import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from 'src/colors/color.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/productImage.entity';
import { ProductViews } from './entities/productViews.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductViews)
    private readonly productViewsRepository: Repository<ProductViews>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          productImages: 'product.productImages',
          color: 'productImages.color',
          views: 'product.views',
        },
      },
    });
  }

  async findAllFiltered(callerUserId: string): Promise<Product[]> {
    let user: User;
    try {
      user = await this.userRepository.findOne(callerUserId, {
        relations: ['viewedProducts'],
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!user)
      throw new NotFoundException(
        `User with the id of ${callerUserId} was not found`,
      );

    const seenProductsIds = user.viewedProducts.map(p => p.productId);

    const lastPostSeen = await this.productRepository.findOne(
      seenProductsIds[seenProductsIds.length - 1],
    );

    const { raw, entities } = await this.productRepository
      .createQueryBuilder('product')
      .addSelect(
        "ts_rank_cd(to_tsvector(coalesce(product.name,'')), plainto_tsquery(:query))",
        'rank',
      )
      .where('product.id NOT IN (:...viewedProductIds)', {
        viewedProductIds: seenProductsIds,
      })
      .orderBy('rank', 'DESC')
      .setParameter('query', lastPostSeen.name)
      .getRawAndEntities();
    const enhancedEntities = entities.map((e, index) => {
      return { ...e, rank: raw[index].rank };
    });

    return enhancedEntities.sort((a, b) => {
      return parseFloat(a.rank) - parseFloat(b.rank);
    });
  }

  async findById(id: string): Promise<Product> {
    return await this.productRepository.findOne(id, {
      join: {
        alias: 'product',
        leftJoinAndSelect: {
          productImages: 'product.productImages',
          color: 'productImages.color',
          views: 'product.views',
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

  async viewProduct(callerUserId: string, productId: string): Promise<Product> {
    if (!callerUserId) {
      throw new UnauthorizedException('Not authorized, please authenticate.');
    }
    let user: User;
    try {
      user = await this.userRepository.findOne(callerUserId, {
        relations: ['viewedProducts'],
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!user) {
      throw new NotFoundException(
        `User with the id of ${callerUserId} was not found`,
      );
    }

    let product: Product;
    try {
      product = await this.productRepository.findOne(productId, {
        join: {
          alias: 'product',
          leftJoinAndSelect: {
            productImages: 'product.productImages',
            color: 'productImages.color',
            views: 'product.views',
          },
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!product) {
      throw new NotFoundException(
        `Product with the id of ${productId} was not found`,
      );
    }

    if (
      await this.productViewsRepository.findOne({
        userId: callerUserId,
        productId,
      })
    ) {
      return product;
    }

    const view = new ProductViews();
    view.userId = callerUserId;
    view.productId = productId;

    await this.productViewsRepository.save(view);

    user.viewedProducts.push(view);
    await this.userRepository.save(user);

    product.views.push(view);
    return await this.productRepository.save(product);
  }

  async unviewProduct(
    callerUserId: string,
    productId: string,
  ): Promise<Product> {
    if (!callerUserId) {
      throw new UnauthorizedException('Not authorized, please authenticate.');
    }
    let user: User;
    try {
      user = await this.userRepository.findOne(callerUserId, {
        relations: ['viewedProducts'],
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!user) {
      throw new NotFoundException(
        `User with the id of ${callerUserId} was not found`,
      );
    }

    let product: Product;
    try {
      product = await this.productRepository.findOne(productId, {
        join: {
          alias: 'product',
          leftJoinAndSelect: {
            productImages: 'product.productImages',
            color: 'productImages.color',
            views: 'product.views',
          },
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!product) {
      throw new NotFoundException(
        `Product with the id of ${productId} was not found`,
      );
    }

    const view = await this.productViewsRepository.findOne({
      userId: callerUserId,
    });
    // if (!view) {
    //   return product;
    // }
    user.viewedProducts = user.viewedProducts.filter(p => p.id !== view.id);
    await this.userRepository.save(user);
    product.views = product.views.filter(p => p.id !== view.id);
    const savedProduct = await this.productRepository.save(product);

    await this.productViewsRepository.remove(view);

    return savedProduct;
  }
}
