import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Agregar este microservicio Kafka
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth-verifier-service',
        brokers: [process.env.KAFKA_BROKER || '3.232.44.31:9092'],
      },
      consumer: {
        groupId: 'auth-verifier-group',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3009); 
}
bootstrap();
