import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages } from 'src/common/messages';
import { CreateProductDto } from './dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: Product,
    description: messages.response.success,
  })
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Product,
    description: messages.response.success,
  })
  async find(@Param('id') id: string): Promise<Product> {
    return await this.productService.findById(id);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Product,
    description: messages.response.success,
  })
  async create(@Body() data: CreateProductDto): Promise<Product> {
    return await this.productService.create(data);
  }
}
