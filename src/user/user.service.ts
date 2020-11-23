import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['viewedProducts'] });
  }

  async findOneById(id: string): Promise<User> {
    let user: User;
    try {
      user = await this.userRepository.findOne(id);
    } catch (err) {
      throw new Error(err);
    }

    if (!user)
      throw new NotFoundException(`User with the id of ${id} was not found`);

    return user;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ email });
  }

  async findOneByGoogleId(googleId: string): Promise<User> {
    let user: User;
    try {
      user = await this.userRepository.findOne({ googleId });
    } catch (err) {
      throw new Error(err);
    }

    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    if (data.email && (await this.findOneByEmail(data.email))) {
      throw new BadRequestException(
        `Email with ${data.email} already exists, please try another email.`,
      );
    }
    const user = new User();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    if (data.password) {
      user.password = await argon2.hash(data.password);
    }
    if (data.googleId) {
      user.googleId = data.googleId;
    }

    try {
      return await this.userRepository.save(user);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    let updatedUser: User;

    try {
      updatedUser = await this.userRepository.findOne(id);
    } catch (err) {
      throw new BadRequestException(`An internal server error happened`);
    }
    if (!updatedUser)
      throw new BadRequestException(
        `User with the id of ${id} was not found in the database`,
      );

    if (data.email && this.findOneByEmail(data.email)) {
      throw new BadRequestException(
        `The email ${data.email} already exists, please try another email`,
      );
    }

    if (data.oldPassword && data.newPassword) {
      const compare = await argon2.verify(
        updatedUser.password,
        data.oldPassword,
      );
      if (!compare) {
        throw new BadRequestException(`Old password is incorrect`);
      } else {
        updatedUser.password = await argon2.hash(data.newPassword);
      }
    } else if (
      (!data.oldPassword && data.newPassword) ||
      (data.oldPassword && !data.newPassword)
    ) {
      throw new BadRequestException(
        `Please provide both Old Password & New Password that you want to change to proceed`,
      );
    }

    const user = Object.assign(updatedUser, data);
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<User> {
    let deletedUser: User;
    try {
      deletedUser = await this.userRepository.findOne(id);
    } catch (err) {
      throw new BadRequestException(`An internal server error happened`);
    }

    if (!deletedUser)
      throw new NotFoundException(`User with the id of ${id} was not found`);

    return await this.userRepository.remove(deletedUser);
  }
}
