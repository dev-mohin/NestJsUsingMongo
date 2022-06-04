import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { RegisterDTO } from './register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/auth/login.dto';
import { Payload } from 'src/types/payload';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private userModel: Model<User>,
  ) { }

  async create(RegisterDTO: RegisterDTO) {
    const { email } = RegisterDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(RegisterDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;
    return this.userModel.findOne({ email });
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('user does not exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user)
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async userDetail() {
    const user = await this.userModel.find();
    if (!user) {
      throw new HttpException('users not fetch', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async specificDetailOfUser() {
    const userAdmin = await this.userModel.find({role: 'admin'});
    if (!userAdmin) {
      throw new HttpException('Admin not fetch', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userModel.find({ role: 'user' });
    if (!userAdmin) {
      throw new HttpException('users not fetch', HttpStatus.BAD_REQUEST);
    }
    return userAdmin.concat(user);
  }

  async getUser() {
    const user = await this.userModel.find({role: 'user'});
    if (!user) {
      throw new HttpException('users not fetch', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

}
