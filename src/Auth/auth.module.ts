import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { userSchema } from "src/User/user.model";
import { UserModule } from "src/User/user.module";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";
import { RtStrategy } from "./strategy/rt.strategy";
import { SubStrategy } from "./strategy/sub.strategy";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
        UserModule,
        PassportModule,
    JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '900s' },
    }),
    ],
    providers: [AuthService, JwtStrategy, LocalStrategy, RtStrategy, SubStrategy],
    exports: [AuthService]
})
export class AuthModule { }