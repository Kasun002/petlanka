export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export interface JwtPayload {
  sub: string;
  type: 'client' | 'admin';
  role?: RoleName;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface OtpRequestResponse {
  message: string;
  expiresInSeconds: number;
}

export interface OtpVerifyResponse extends AuthTokens {
  isNewUser: boolean;
}

export interface AdminLoginResponse extends AuthTokens {
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: RoleName;
  };
}

export interface AuthenticatedUser {
  id: string;
  type: 'client' | 'admin';
  role?: RoleName;
}
