import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class SubStrategy extends PassportStrategy(Strategy, 'sub') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretKey',
        })
    }

    async validate(payload: any) {

        return { username: payload };
    }

}