import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { TokenValidationRequest } from './auth.interface';
import { KafkaTopics } from '../kafka/kafka-topics.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Token Verification')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Kafka consumer for standard token validation.
   * Triggered when a message is sent to the VERIFY_TOKEN topic.
   */
  @MessagePattern(KafkaTopics.VERIFY_TOKEN)
  verify(@Payload() data: TokenValidationRequest) {
    return this.authService.validateToken(data);
  }

  /**
   * HTTP endpoint to manually validate a token.
   * This is mainly for testing purposes (e.g., Swagger).
   */
  @Post('/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify JWT token (HTTP fallback)' })
  @ApiResponse({
    status: 200,
    description: 'Token validated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token format or data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token invalid or expired',
  })
  httpVerify(@Body() data: TokenValidationRequest) {
    return this.authService.validateToken(data);
  }
}
