import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorController } from './color.controller';
import { Color } from './color.entity';
import { ColorService } from './color.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Color]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ColorService],
  controllers: [ColorController],
  exports: [ColorService],
})
export class ColorModule {}
