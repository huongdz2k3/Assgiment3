import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Date } from "mongoose";

export type TodoDocument = Todo & Document

@Schema()
export class Todo {
    @Prop()
    description: string
    @Prop({ type: Date })
    duedate: string
    @Prop({ required: false, default: '' })
    colorcode: string
}

const todoSchema = SchemaFactory.createForClass(Todo)

export { todoSchema }