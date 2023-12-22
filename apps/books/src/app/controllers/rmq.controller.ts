import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RmqBookAccessEnum } from '../enums/rmq-access.enum';
import { AccessService } from '../services';
import { AccessBookEnum } from '../enums';

@Controller()
export class AccessBookRabbitMQConsumerController {
  private readonly logger = new Logger(AccessBookRabbitMQConsumerController.name);

  constructor(private accessService: AccessService) {}

  @MessagePattern(RmqBookAccessEnum.Update)
  async userCreated(data: string) {
    const accessData: any = JSON.parse(data);

    await this.accessService.updatePlan(
      accessData.userId,
      AccessBookEnum.Premium
    );
  }
}
