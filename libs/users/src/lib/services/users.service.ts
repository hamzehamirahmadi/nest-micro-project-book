import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { User, UserDocument, UserSchemaName } from '../schemas/user.schema';
import { RabbitMqClient } from '@libs/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchemaName) private usersModel: Model<User>,
    private rabbitClient: RabbitMqClient
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.usersModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.usersModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.usersModel.findById(id);
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.usersModel.findOne({ username }).exec();
  }

  async updateAndSendQ(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserDocument | null> {
    const updateResult = this.update(id, updateUserDto);
    this.rabbitClient.sendMessage('userUpdated', { id, updateUserDto });
    return updateResult;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserDocument | null> {
    return await this.usersModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async removeAndSendQ(id: string): Promise<UserDocument | unknown> {
    const removeResult = await this.remove(id);
    this.rabbitClient.sendMessage('userRemoved', { id });

    return removeResult;
  }

  async remove(id: string): Promise<UserDocument | unknown> {
    return await this.usersModel.findByIdAndDelete(id).exec();
  }
}
