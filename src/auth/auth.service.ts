import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService
    ){}

    public signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void>{
        return this.usersRepository.createUser(authCredentialsDTO);
    }

    public async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<{accessToken: string}> {
        const {email, password} = authCredentialsDTO;
        const user = await this.usersRepository.findOne({email});

        if(user && (await bcrypt.compare(password, user.password))){
            const payload: JWTPayload = {email};

            const accessToken = await this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your credentials');
        }
    }
}
