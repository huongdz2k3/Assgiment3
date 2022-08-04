import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ToDoQL {
    @Field()
    description: string
    @Field()
    duedate: string
    @Field()
    colorCode: string
}