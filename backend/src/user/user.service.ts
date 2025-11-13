import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async register(dto: RegisterUserDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.userModel.findOne({ email }).lean();
    if (existing) {
      throw new BadRequestException('Email already registered.');
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(dto.password, salt);

      const user = new this.userModel({ email, password: passwordHash });
      await user.save();

      return { message: 'User registered successfully.' };
    } catch (err: any) {
      if (err?.code === 11000) {
        // duplicate key
        throw new BadRequestException('Email already registered');
      }
      throw new InternalServerErrorException('Failed to register user exit');
    }
  }
}
