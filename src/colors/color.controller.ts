import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages } from 'src/common/messages';
import { Color } from './color.entity';
import { ColorService } from './color.service';
import { ColorQueryDto, CreateColorDto, UpdateColorDto } from './dto';

@ApiTags('colors')
@ApiBearerAuth()
@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: Color,
    description: messages.response.success,
  })
  async findAll(@Query() query: ColorQueryDto): Promise<Color[]> {
    return await this.colorService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Color,
    description: messages.response.success,
  })
  async findById(@Param('id') id: string) {
    return await this.colorService.findOneById(id);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Color,
    description: messages.response.success,
  })
  @UseGuards(AuthGuard())
  async create(@Body() data: CreateColorDto): Promise<Color> {
    return await this.colorService.create(data);
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Color,
    description: messages.response.success,
  })
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() data: UpdateColorDto,
  ): Promise<Color> {
    return await this.colorService.update(id, data);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Color,
    description: messages.response.success,
  })
  @UseGuards(AuthGuard())
  async delete(@Param('id') id: string): Promise<Color> {
    return await this.colorService.delete(id);
  }
}
