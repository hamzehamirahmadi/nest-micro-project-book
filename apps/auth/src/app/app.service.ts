import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CreateUserDto, SignInUserDto, UsersService } from '@libs/users';
import * as argon2 from 'argon2';
import { RabbitMqClient } from '@libs/utils';
import { v4 as uuidv4 } from 'uuid';

const amqp = require('amqplib');

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private rabbitMqClient: RabbitMqClient
  ) { }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findByUsername(
      createUserDto.username
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = await argon2.hash(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      _id: uuidv4(),
      password: hash,
    });
    this.rabbitMqClient.sendMessage('userCreated', {
      ...createUserDto,
      password: '',
      _id: newUser._id,
    });
    const tokens = await this.generateToken({
      _id: newUser._id,
      username: newUser.username,
    });
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(signInUserDto: SignInUserDto) {
    const user = await this.usersService.findByUsername(signInUserDto.username);
    if (!user) throw new BadRequestException('Uassword is incorrect');

    const passwordMatches = await argon2.verify(
      user.password,
      signInUserDto.password
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.generateToken({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.generateToken({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async generateToken(payload: any) {
    return {
      accessToken: await this.jwtService.signAsync(
        payload,
        this.getJwtConfig('ACCESS')
      ),
      refreshToken: await this.jwtService.signAsync(
        payload,
        this.getJwtConfig('REFRESH')
      ),
    };
  }

  getJwtConfig(type: string): JwtSignOptions {
    return {
      secret: this.configService.get<string>(`JWT_${type}_SECRET`),
      expiresIn: this.configService.get<string>(`JWT_${type}_EXPIRE_TIME`),
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
