import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { CreateUserDto } from 'src/user/dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto';
import * as argon2 from 'argon2';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: CreateUserDto): Promise<User> {
    return await this.userService.create(data);
  }

  async login(data: LoginUserDto) {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException(
        `User with ${data.email} does not exist`,
        'unknown_user',
      );
    }

    if (user) {
      const compare = await argon2.verify(user.password, data.password);
      if (compare) {
        const accessToken = this.jwtService.sign({
          id: user.id,
          email: user.email,
        });
        return {
          token: accessToken,
          expiresIn: this.configService.jwtExpiresIn,
        };
      } else {
        throw new UnauthorizedException('Incorrect Credentials');
      }
    }
  }

  async validateUser(payload: JwtPayload): Promise<User | undefined> {
    return await this.userService.findOneByEmail(payload.email);
  }

  async validateOAuthUser(profile: any) {
    let user: User;
    try {
      if (profile.googleId) {
        /** 0. Check if an user already have the existing google id */
        user = await this.userService.findOneByGoogleId(profile.googleId);

        /** 1. Proceed to register if that user doesn't exist */
        if (!user) {
          user = await this.userService.create(profile);
        }
        /** 2. Sign JWT Secret */
        return sign(
          {
            id: user.id,
            email: user.email,
          },
          this.configService.jwtSecret,
          { expiresIn: this.configService.jwtExpiresIn },
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'Google OAuth Failed',
        err?.message,
      );
    }
  }
}
