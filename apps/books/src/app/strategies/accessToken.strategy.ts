import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { AccessService } from '../services';
import { AccessBookEnum } from '../enums';

@Injectable()
export class AccessBookStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
) {
  constructor(private accessService: AccessService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env['JWT_ACCESS_SECRET'],
    });
  }

  async validate(payload: any) {
    let access = AccessBookEnum.Normal;
    if (payload && payload._id) {
      const accessData = await this.accessService.getByUserId(payload._id);
      if (accessData && accessData.accuntType === AccessBookEnum.Premium) {
        access = AccessBookEnum.Premium;
      }
    }
    return { ...payload, accessBook: access };
  }
}
