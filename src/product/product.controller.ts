import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages } from 'src/common/messages';
import { CreateProductDto } from './dto';
import { Product } from './entities/product.entity';
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

  @Get('/user')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    type: Product,
    description: messages.response.success,
  })
  async findFiltered(@Request() req): Promise<Product[]> {
    const callerUserId = req.user.id;
    return await this.productService.findAllFiltered(callerUserId);
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

  @Get(':id/view')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    type: Product,
    description: messages.response.success,
  })
  async viewProduct(@Request() req, @Param('id') id) {
    const callerUserId = req.user.id;
    return await this.productService.viewProduct(callerUserId, id);
  }

  @Get(':id/unview')
  @UseGuards(AuthGuard())
  @ApiResponse({
    status: HttpStatus.OK,
    type: Product,
    description: messages.response.success,
  })
  async unviewProduct(@Request() req, @Param('id') id) {
    const callerUserId = req.user.id;
    return await this.productService.unviewProduct(callerUserId, id);
  }
}
