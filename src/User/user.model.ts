import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Todo } from "src/Todo/todo.model";
import * as bcrypt from 'bcrypt'
export type UserDocument = User & Document

@Schema()
export class User {
    @Prop()
    id: string
    @Prop({ unique: true })
    username: string
    @Prop()
    password: string
    @Prop({ default: [] })
    lists: Todo[]
    @Prop()
    refreshToken: string
}
const userSchema = SchemaFactory.createForClass(User)
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

export { userSchema }