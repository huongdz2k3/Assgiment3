
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthService } from "src/Auth/auth.service";
import { LoginInput } from "./input/login.input";
import { SignupInput } from "./input/signup.input";
import { LoginOutput } from "./output/login.output";
import { UserQL } from "./user.schema";

@Resolver(of => UserQL)
export class UserResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => LoginOutput)
    async login(@Args('username') username: string, @Args('password') password: string) {
        const user = await this.authService.validateUser(username, password)
        return await this.authService.login(user)
    }

    @Mutation(() => LoginOutput)
    async signup(@Args('username') username: string, @Args('password') password: string, @Args('passwordConfirm') passwordConfirm: string) {
        const user = await this.authService.signup(username, password, passwordConfirm)
        return await this.authService.login(user)
    }

    @Query(() => String)
    sayHello(): string {
        return 'Hello World!';
    }
}