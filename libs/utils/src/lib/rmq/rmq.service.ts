import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DiscoveredMethodWithMeta,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { MessageInterface } from './message.interface';
import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/types/AmqpConnectionManager';

@Injectable()
export class RabbitMqClient {
  constructor(
    private configService: ConfigService,
    private readonly discoveryService: DiscoveryService
  ) {
    this.prepareQueue();
  }

  async prepareQueue() {
    const scanResult: DiscoveredMethodWithMeta<string[]>[] =
      await this.discoveryService.controllerMethodsWithMetaAtKey(
        'microservices:pattern'
      );

    const connection: IAmqpConnectionManager = await amqp.connect(
      this.configService.get('RABBITMQ_URL')
    );
    const channelWrapper: ChannelWrapper = connection.createChannel();

    const exchangeName: string = this.configService
      .get('RABBITMQ_EXCHANGE')
      .toString();
    const queueName: string = this.configService
      .get('RABBITMQ_QUEUE')
      .toString();

    channelWrapper.addSetup((channel: ChannelWrapper) => {
      return Promise.all([
        channel.assertQueue(queueName, { durable: false }),
        channel.assertExchange(exchangeName, 'direct', { durable: false }),
        ...scanResult.map((key: DiscoveredMethodWithMeta<string[]>) =>
          channel.bindQueue(queueName, exchangeName, key.meta[0])
        ),
      ]);
    });
  }

  async sendMessage(pattern: string, data: any) {
    const connection: IAmqpConnectionManager = await amqp.connect(
      this.configService.get('RABBITMQ_URL')
    );
    const channel: ChannelWrapper = await connection.createChannel({
      json: true,
    });

    const message: MessageInterface = { pattern, data: JSON.stringify(data) };

    try {
      await channel.publish(
        this.configService.get('RABBITMQ_EXCHANGE') as string,
        pattern,
        message
      );
    } finally {
      await connection.close();
    }
  }
}
