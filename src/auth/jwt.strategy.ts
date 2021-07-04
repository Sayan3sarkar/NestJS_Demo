import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  // This is responsible for authorizing users who make requests after signing in
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // JWT sent as Bearer Token in the Authorization header
    });
  }

  // This method defines what to do once the token is validated
  public async validate(payload: JWTPayload): Promise<User> {
    const { email } = payload;

    const user: User = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // Passport injects this user into the request object so that we have it available when needed
  }
}
