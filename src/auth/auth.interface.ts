export interface TokenValidationRequest {
  token: string;
  requiredRoles?: string[];
}

export interface TokenValidationResponse {
  isValid: boolean;
  payload?: any;
  error?: string;
}

export interface TokenValidationRequestWithOrigin
  extends TokenValidationRequest {
  origin?: string;
  requestId?: string;
}
