import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { number, object, ObjectSchema, string } from 'yup';
import { Injectable, Logger } from '@nestjs/common';

interface ENV {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly env: ENV = {};
  private readonly logger: Logger = new Logger(ConfigService.name);

  constructor() {
    let config: any;
    try {
      config = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV}.env`));
    } catch (err) {
      this.logger.error(`No ${process.env.NODE_ENV}.env file was found`);
    }

    if (config) {
      this.env = this.validateInput(config);
    }
  }

  private validateInput(config: ENV): ENV {
    const envSchema: ObjectSchema = object({
      DB_NAME: string().required(),
      DB_HOST: string().default('localhost'),
      DB_USERNAME: string().required(),
      DB_PASSWORD: string().required(),
      DB_PORT: number().default('5432'),
      JWT_SECRET: string().required(),
      JWT_EXPIRES_IN: number().default(30 * 24 * 60 * 60),
      APP_PORT: number().default(8080),
      GOOGLE_CLIENT_ID: string().required(),
      GOOGLE_CLIENT_SECRET: string().required(),
    });

    try {
      const validatedEnv = envSchema.validateSync(config) as ENV;
      return validatedEnv;
    } catch (err) {
      throw new Error(
        `Application configuration error, please check your configuration (.env)`,
      );
    }
  }

  get appDomain(): string {
    let domain: string;
    switch (process.env.NODE_ENV) {
      case 'development':
        domain = 'http://localhost:8080';
        break;
      case 'production':
        domain = 'https://stronkapp.com';
        break;
      default:
        domain = 'http://stronkapp.com';
        break;
    }

    return domain;
  }

  get webDomain(): string {
    let domain: string;
    switch (process.env.NODE_ENV) {
      case 'development':
        domain = 'http://localhost:3030';
        break;
      case 'production':
        domain = 'https://fabelio.stevenhansel.com';
        break;
      default:
        domain = 'http://fabelio.stevenhansel.com';
        break;
    }

    return domain;
  }

  get appPort(): number {
    return Number(this.env.APP_PORT);
  }

  get jwtSecret(): string {
    return this.env.JWT_SECRET;
  }

  get jwtExpiresIn(): number {
    return Number(this.env.JWT_EXPIRES_IN);
  }

  get googleClientId(): string {
    return this.env.GOOGLE_CLIENT_ID;
  }

  get googleClientSecret(): string {
    return this.env.GOOGLE_CLIENT_SECRET;
  }

  get databaseName(): string {
    return this.env.DB_NAME;
  }

  get databaseHost(): string {
    return this.env.DB_HOST;
  }

  get databaseUsername(): string {
    return this.env.DB_USERNAME;
  }

  get databasePassword(): string {
    return this.env.DB_PASSWORD;
  }

  get databasePort(): number {
    return Number(this.env.DB_PORT);
  }
}
