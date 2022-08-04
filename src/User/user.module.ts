import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./../Auth/auth.module";
import { userSchema } from "./user.model";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
    imports: [forwardRef(() => AuthModule), MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
    providers: [UserService, UserResolver,],
    exports: [UserService]
})
export class UserModule { }