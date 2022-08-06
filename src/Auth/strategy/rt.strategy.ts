import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from "../constants";
import { Request } from "express"
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'secretRtKey',
        })
    }

    async validate(payload: any) {
        return { username: payload.username };
    }

}