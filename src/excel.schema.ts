import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ExcelQL {
    @Field()
    status: string
}