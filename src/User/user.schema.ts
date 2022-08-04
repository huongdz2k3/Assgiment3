import { Field, ObjectType } from "@nestjs/graphql";
import { ToDoQL } from "src/Todo/todo.schema";

@ObjectType()
export class UserQL {
    @Field()
    username: string
    @Field()
    password: string
    @Field(type => [ToDoQL])
    lists!: ToDoQL[]
    @Field()
    id!: string
}