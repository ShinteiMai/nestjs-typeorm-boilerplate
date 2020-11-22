import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { OAuthStrategy } from './enums/OAuthStrategy.enum';
import { ConfigService } from 'src/config/config.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Get('google')
  @ApiResponse({})
  @UseGuards(AuthGuard(OAuthStrategy.GOOGLE))
  async google() {
    /** Initialize Google OAuth 2.0. Flow */
  }

  @Get('google/redirect')
  @ApiResponse({})
  @UseGuards(AuthGuard(OAuthStrategy.GOOGLE))
  async googleRedirect(@Req() req, @Res() res) {
    const jwt: string = req.user.jwt;
    const domain = this.configService.webDomain;
    if (jwt) {
      res.redirect(`${domain}/auth/google`);
    } else {
      res.redirect(`${domain}/auth/login`);
    }
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
