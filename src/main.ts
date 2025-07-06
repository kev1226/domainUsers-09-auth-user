import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Entry point of the Auth Verifier Service.
 * Sets up Swagger, CORS, and Kafka microservice configuration.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Connect Kafka microservice
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

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Auth Verifier Microservice')
    .setDescription('Kafka and HTTP-based token validator')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Swagger UI at /docs

  await app.startAllMicroservices();
  await app.listen(3009);
}
bootstrap();
