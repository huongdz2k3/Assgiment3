import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SignupInput {
    @Field()
    username: string
    @Field()
    password: string
    @Field()
    passwordConfirm: string
}