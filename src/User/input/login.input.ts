import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginInput {
    @Field()
    username: string
    @Field()
    password: string
}