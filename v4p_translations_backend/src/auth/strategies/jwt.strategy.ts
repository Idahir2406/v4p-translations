import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

type JwtPayload = {
  sub: string;
  user: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const extractTokenFromQuery = (request: Request): string | null => {
      const queryToken = request?.query?.access_token;
      if (typeof queryToken === 'string' && queryToken.trim().length > 0) {
        return queryToken;
      }

      return null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        extractTokenFromQuery,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'v4p-dev-secret',
    });
  }

  validate(payload: JwtPayload) {
    return {
      user: payload.user,
      sub: payload.sub,
    };
  }
}
