import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('signup')
    @UsePipes(ValidationPipe)
    public signUp(@Body() authCredentialsDTO:AuthCredentialsDTO): Promise<void> {
        return this.authService.signUp(authCredentialsDTO);
    }

    @Post('signin')
    @UsePipes(ValidationPipe)
    public signIn(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<{accessToken: string}> {
        return this.authService.signIn(authCredentialsDTO);
    }
}
