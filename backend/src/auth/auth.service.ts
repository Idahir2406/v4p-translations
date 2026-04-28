import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type AuthUser = {
  user: string;
};

@Injectable()
export class AuthService {
  private readonly user: string;
  private password: string;

  constructor(private readonly jwtService: JwtService) {
    this.user = 'adminv4patas';
    this.password = 'VeJo!v4p!2025-1';
  }

  validateUser(user: string, password: string): AuthUser {
    if (user === this.user && password === this.password) {
      return { user: this.user };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  login(user: AuthUser) {
    const payload = { sub: user.user, user: user.user };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: user.user,
    };
  }
}
