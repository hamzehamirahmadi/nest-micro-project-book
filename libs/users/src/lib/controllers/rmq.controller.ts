import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { RmqUsersPatternEnum } from '../enums';
import { UsersService } from '../services/users.service';

@Controller()
export class UserRabbitMQConsumerController {
  private readonly logger = new Logger(UserRabbitMQConsumerController.name);

  constructor(private usersService: UsersService) {}

  @MessagePattern(RmqUsersPatternEnum.Created)
  async userCreated(data: string) {

    const userData: CreateUserDto = JSON.parse(data);

    const userExists = await this.usersService.findByUsername(
      userData.username
    );
    if (userExists) {
      return;
    }

    await this.usersService.create({
      ...userData,
      refreshToken: 'null',
      password: 'null',
    });
    return;
  }

  @MessagePattern(RmqUsersPatternEnum.Updated)
  async userUpdated(data: string) {
    const userData: { id: string; updateUserDto: UpdateUserDto } =
      JSON.parse(data);

    await this.usersService.update(userData.id, userData.updateUserDto);
    return;
  }

  @MessagePattern(RmqUsersPatternEnum.Removed)
  async userRemoved(data: string) {
    const userData: { id: string } = JSON.parse(data);
    const userExists = await this.usersService.findById(userData.id);
    if (!userExists) {
      return;
    }

    await this.usersService.remove(userData.id);
    return;
  }
}
