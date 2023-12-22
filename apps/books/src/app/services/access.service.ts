import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessBookEnum } from '../enums';
import { Access, AccessDocument, AccessSchemaName } from '../schames';

@Injectable()
export class AccessService {
  constructor(
    @InjectModel(AccessSchemaName) private accessModel: Model<Access>
  ) {}

  async updatePlan(userId: string, type: AccessBookEnum) {
    return await this.accessModel.findOneAndUpdate(
      { accuntType: type, expireIn: new Date() },
      { userId },
      { upsert: true, new: true }
    );
  }

  async getByUserId(id: string): Promise<AccessDocument> {
    return this.accessModel.findOne({ userId: id }).exec();
  }
}
