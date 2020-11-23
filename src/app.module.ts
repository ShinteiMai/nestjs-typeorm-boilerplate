import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Color } from './colors/color.entity';
import { ColorModule } from './colors/color.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { ProductImage } from './product/entities/productImage.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { ProductViews } from './product/entities/productViews.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUsername,
        password: configService.databasePassword,
        database: configService.databaseName,
        entities: [User, Color, Product, ProductImage, ProductViews],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ColorModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
