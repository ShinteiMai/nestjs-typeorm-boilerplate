import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from 'src/config/config.service';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.googleClientId,
      clientSecret: configService.googleClientSecret,
      callbackURL: `${configService.appDomain}/auth/google/redirect`,
      passReqToCallback: true,
      scope: ['profile email'],
    });
  }

  async validate(
    response: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
    _: any,
  ) {
    try {
      const jwt = await this.authService.validateOAuthUser({
        firstName: profile?.name?.givenName,
        lastName: profile?.name?.familyName,
        email: profile?.emails[0]?.value,
        googleId: profile?.id,
        response,
        accessToken,
        refreshToken,
        _,
      });
      done(null, { jwt });
    } catch (err) {
      done(err, false);
    }
  }
}
