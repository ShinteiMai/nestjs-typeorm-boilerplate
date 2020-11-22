import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created an user ',
  })
  async signUp(@Body() data: CreateUserDto): Promise<User> {
    return await this.authService.signup(data);
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Login successful',
  })
  async login(@Body() data: LoginUserDto) {
    return await this.authService.login(data);
  }

  @Get('guard')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async protected() {
    return {
      message: 'This route was protected',
    };
  }
}
