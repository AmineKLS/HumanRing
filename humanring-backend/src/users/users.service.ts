import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}


  async findByAuth0sub(userId: string) {
    const user = await this.userModel.findOne({ auth0sub: userId }).exec();
    return user;
  }
}

