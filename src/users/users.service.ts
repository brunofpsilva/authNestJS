import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { cleanUser } from '../utils/users';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  /**
   * Create User
   */
  async create(_user: UserDto) {
    const user = await this.userModel.findOne({ email: _user.email });

    if (user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    const createdUser = new this.userModel(_user);
    await createdUser.save();

    return cleanUser(createdUser);
  }

  /**
   * Get All Users
   * */
  async getAll(filter: any): Promise<User[]> {
    const users = await this.userModel.find(filter);

    return users.map((user) => cleanUser(user));
  }
  /**
   * Get user based on filter protected
   */
  async getOne(filter: any): Promise<User> {
    const user = await this.userModel.findOne(filter);

    return cleanUser(user);
  }
  /**
   * Get user based on filter not protected
   */
  async getOneLogin(filter: any): Promise<User> {
    return this.userModel.findOne(filter);
  }

  /**
   * Update user based on filter
   */
  async updateOne(filter: any, updateDoc) {
    return this.userModel.updateOne(filter, updateDoc);
  }
}
