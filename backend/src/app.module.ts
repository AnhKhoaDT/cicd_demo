import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';

// Ensure environment variables are loaded before reading process.env here
dotenv.config();

@Module({
  imports: [
    // Load .env automatically and make it available globally
    ConfigModule.forRoot({ isGlobal: true }),
    // Read Mongo URI at runtime (after env is loaded)
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // Fallback to local mongo if env is missing to avoid invalid scheme errors
        uri:
          config.get<string>('MONGODB_URI') ||
          process.env.MONGODB_URI ||
          '',
      }),
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
