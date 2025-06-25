import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  TokenValidationRequest,
  TokenValidationRequestWithOrigin,
} from './auth.interface';
import { KafkaTopics } from '../kafka/kafka-topics.enum';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(KafkaTopics.VERIFY_TOKEN)
  verify(@Payload() data: TokenValidationRequest) {
    return this.authService.validateToken(data);
  }

  @MessagePattern(KafkaTopics.VERIFY_TOKEN_CART)
  async handleVerifyToken(@Payload() data: TokenValidationRequestWithOrigin) {
    console.log('📥 Mensaje recibido en AUTH VERIFIER desde Kafka');
    console.log('🔧 Payload recibido:', JSON.stringify(data));

    await this.authService.validateTokenAndRespond(data);
  }

  // HTTP endpoint temporal para pruebas
  @Post('/verify')
  httpVerify(@Body() data: TokenValidationRequest) {
    return this.authService.validateToken(data);
  }
}
