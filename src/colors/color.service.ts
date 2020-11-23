import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from './color.entity';
import { ColorQueryDto, CreateColorDto, UpdateColorDto } from './dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async findAll(query: ColorQueryDto): Promise<Color[]> {
    if (query.name) {
      return await this.colorRepository
        .createQueryBuilder('color')
        .where('LOWER(color.name) like LOWER(:name)', {
          name: `%${query.name}%`,
        })
        .limit(query.limit || 25)
        .getMany();
    } else {
      return await this.colorRepository
        .createQueryBuilder('color')
        .limit(query.limit || 25)
        .getMany();
    }
  }

  async findOneById(id: string): Promise<Color> {
    return await this.colorRepository.findOne(id);
  }

  async findOneByName(name: string): Promise<Color> {
    return await this.colorRepository.findOne({ name });
  }

  async findOneByHex(hex: string): Promise<Color> {
    return await this.colorRepository.findOne({ hex });
  }

  async create(data: CreateColorDto): Promise<Color> {
    if (data.hex && (await this.findOneByHex(data.hex))) {
      throw new BadRequestException(
        `Hex of ${data.hex} already exists in the database.`,
      );
    }

    const color = new Color();
    color.name = data.name;
    color.hex = data.hex;

    try {
      return await this.colorRepository.save(color);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async update(id: string, data: UpdateColorDto): Promise<Color> {
    let updatedColor: Color;

    try {
      updatedColor = await this.findOneById(id);
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!updatedColor) {
      throw new NotFoundException(`Color with the id of ${id} was not found`);
    }

    if (
      data.hex &&
      (await this.findOneByHex(data.hex)) &&
      id.toString() !== updatedColor.id.toString()
    ) {
      throw new BadRequestException(
        `Hex of ${data.hex} already exists in the database.`,
      );
    }

    const color = Object.assign(updatedColor, data);
    return await this.colorRepository.save(color);
  }

  async delete(id: string): Promise<Color> {
    let deletedColor: Color;
    try {
      deletedColor = await this.findOneById(id);
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (!deletedColor) {
      throw new NotFoundException(`Color with the id of ${id} was not found`);
    }

    return await this.colorRepository.remove(deletedColor);
  }
}
