import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';

const jwtMock = {
  signAsync: jest.fn(async () => 'token'),
  verifyAsync: jest.fn(async () => ({ sub: '1', email: 'a@b.com' })),
};

const configMock = {
  get: (k: string) => ({
    JWT_ACCESS_SECRET: 'a',
    JWT_REFRESH_SECRET: 'b',
    JWT_ACCESS_EXPIRES_IN: '15m',
    JWT_REFRESH_EXPIRES_IN: '7d',
  } as any)[k],
};

describe('AuthService', () => {
  it('validateUser throws when not found', async () => {
    const userModel: any = { findOne: jest.fn(async () => null) };
    const svc = new AuthService(userModel, jwtMock as any, configMock as any);
    await expect(svc.validateUser('a@b.com', 'x')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('refresh returns new access token for valid token', async () => {
    const userModel: any = { findById: jest.fn(() => ({
      lean: jest.fn(async () => ({ _id: '1', email: 'a@b.com' })),
    })) };
    const svc = new AuthService(userModel, jwtMock as any, configMock as any);
    const res = await svc.refresh('rt');
    expect(res).toEqual({ accessToken: 'token' });
  });

  it('refresh throws when missing token', async () => {
    const svc = new AuthService({} as any, jwtMock as any, configMock as any);
    await expect(svc.refresh('')).rejects.toBeInstanceOf(BadRequestException);
  });
});
