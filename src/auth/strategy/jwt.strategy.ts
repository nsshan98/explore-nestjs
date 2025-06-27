import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET') || 'defaultSecretKey',
        })
    }

    async validate(payload: { sub: string, email: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            }
        })
        if (!user) {
            return {
                msg: 'User not found',
                statusCode: 404,
            }; // or throw an exception if you prefer
        }
        const { password, ...rest } = user;
        return { ...rest }
    }

}