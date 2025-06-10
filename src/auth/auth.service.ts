import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return { msg: 'User signed up successfully' };
  }

  login() {
    return { msg: 'User logged in successfully' };
  }
}
