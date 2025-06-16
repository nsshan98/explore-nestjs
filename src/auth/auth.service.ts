import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }
  async signup(dto: AuthDto) {
    const hashPassword = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email,
          password: hashPassword,
        }

      })
      console.log(user, 'auth.service.ts');
      return { msg: 'User signed up successfully', user };
    } catch (error) {
      console.error('Error during signup:', error.code, error.message);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists with this email');
        }
      }
      else {
        throw new Error('Signup failed');
      }
    }
  }

  login() {
    return { msg: 'User logged in successfully' };
  }
}
