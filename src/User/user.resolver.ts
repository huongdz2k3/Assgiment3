
import { Req, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { use } from "passport";
import { AuthService } from "src/Auth/auth.service";
import { JwtAuthGuard } from "src/Auth/guard/jwt-auth.guard";
import { } from "src/Auth/strategy/rt.strategy";
import { LoginInput } from "./input/login.input";
import { SignupInput } from "./input/signup.input";
import { LoginOutput } from "./output/login.output";
import { LogoutOutput } from "./output/logout.output";
import { RefreshToken } from "./rt.decorator.graphql";
import { CurrentUser } from "./user.decorator.graphql";
import { UserQL } from "./user.schema";

@Resolver(of => UserQL)
export class UserResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => LoginOutput)
    async login(@Args('username') username: string, @Args('password') password: string) {
        return await this.authService.validateUser(username, password)
    }

    @Mutation(() => LoginOutput)
    async signup(@Args('username') username: string, @Args('password') password: string, @Args('passwordConfirm') passwordConfirm: string) {
        return await this.authService.signup(username, password, passwordConfirm)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => LogoutOutput)
    async logout(@CurrentUser() user: { username: string, rt: string }) {
        return await this.authService.logout(user.username)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => LoginOutput)
    async refreshToken(@CurrentUser() user: { username: string, rt: string }) {
        // const user = req.user
        return await this.authService.refreshToken(user.username, user.rt)
    }
    @Query(() => String)
    sayHello(): string {
        return 'Hello World!';
    }
}