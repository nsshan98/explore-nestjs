import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, SignUpAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  signup(@Body() dto: SignUpAuthDto) {
    console.log(dto, 'auth.controller.ts');
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAuthDto) {
    console.log(dto, 'auth.controller.ts');
    return this.authService.login(dto);
  }
}
