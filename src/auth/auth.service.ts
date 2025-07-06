import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import {
  TokenValidationRequest,
  TokenValidationRequestWithOrigin,
  TokenValidationResponse,
} from './auth.interface';
import { KafkaServices } from '../kafka/kafka-constants';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject(KafkaServices.AUTH_VERIFIER_SERVICE)
    private readonly kafkaClient: ClientKafka,
  ) {}
  private readonly secret = 'kalemat2025';

  validateToken(data: TokenValidationRequest): TokenValidationResponse {
    try {
      const token = data.token.replace('Bearer ', '');
      const decoded = jwt.verify(token, this.secret) as any;

      const roles = Array.isArray(decoded.roles)
        ? decoded.roles
        : [decoded.roles];

      if (
        data.requiredRoles &&
        !roles.includes('admin') &&
        !data.requiredRoles.some((r) => roles.includes(r))
      ) {
        return { isValid: false, error: 'Forbidden: role not allowed' };
      }

      return { isValid: true, payload: { ...decoded, roles } };
    } catch (err) {
      return { isValid: false, error: err.message };
    }
  }
}
