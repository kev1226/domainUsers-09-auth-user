import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';

describe('AuthService - validateToken', () => {
  let service: AuthService;

  const mockKafkaClient = {}; // no se usa en esta prueba

  beforeEach(() => {
    service = new AuthService(mockKafkaClient as any);
  });

  it('debe validar correctamente un token con rol permitido', () => {
    const tokenPayload = {
      id: 1,
      email: 'test@example.com',
      roles: ['user'],
    };

    const token = jwt.sign(tokenPayload, 'kalemat2025');

    const result = service.validateToken({
      token: `Bearer ${token}`,
      requiredRoles: ['user'],
    });

    expect(result.isValid).toBe(true);
    expect(result.payload?.email).toBe('test@example.com');
    expect(result.payload?.roles).toContain('user');
  });
});
