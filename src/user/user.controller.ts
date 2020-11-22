import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages } from 'src/common/messages';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all Users
   */
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: messages.response.success,
  })
  @UseGuards(AuthGuard())
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  /**
   * Get a specific user (:id)
   */
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: messages.response.success,
  })
  @UseGuards(AuthGuard())
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }

  /**
   * Create User
   */
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: User,
    description: messages.response.success,
  })
  @UseGuards(AuthGuard())
  async create(@Body() data: CreateUserDto): Promise<User> {
    return await this.userService.create(data);
  }

  /**
   * Update User
   */

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: messages.response.success,
  })
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, data);
  }

  /**
   * Delete User
   */
  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: messages.response.success,
  })
  @UseGuards(AuthGuard())
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
