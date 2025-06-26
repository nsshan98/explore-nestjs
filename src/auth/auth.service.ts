import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto, SignUpAuthDto } from './dto';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
  async signup(dto: SignUpAuthDto) {
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

  async login(dto: LoginAuthDto) {
    const userExits = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    })
    if (!userExits) {
      throw new ForbiddenException('User does not exist');
    }
    const matchPassword = await argon.verify(userExits.password, dto.password)
    if (!matchPassword) {
      throw new ForbiddenException('Incorrect password');
    }
    const { password, ...user } = userExits;
    // return { msg: 'User logged in successfully', ...user };
    return this.signToken(userExits.id, userExits.email);
  }


  async signToken(userId: string, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email
    }

    const secret = this.config.get('JWT_SECRET')
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    })

    return { access_token: token }
  }
}
