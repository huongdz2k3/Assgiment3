import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TodoDocument = Todo & Document

@Schema()
export class Todo {
    @Prop()
    id: string
    @Prop()
    description: string
    @Prop()
    duedate: string
    @Prop()
    colorcode: string
}

const todoSchema = SchemaFactory.createForClass(Todo)

export { todoSchema }