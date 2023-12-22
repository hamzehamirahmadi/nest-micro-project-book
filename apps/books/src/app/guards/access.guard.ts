import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if(!request.headers.authorization){
      return false;
    }

    const token = request.headers.authorization.split(' ')[1];

    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env['JWT_ACCESS_SECRET'],
      });

      
      return true;
    } catch (error) {
      return false;
    }
  }
}
