import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signup() {
    return { msg: 'User signed up successfully' };
  }

  login() {
    return { msg: 'User logged in successfully' };
  }
}
