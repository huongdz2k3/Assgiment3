import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/User/user.model";
import { Todo } from "./todo.model";

@Injectable()
export class TodoService {
    constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>, @InjectModel('User') private readonly userModel: Model<User>) { }
    async createTodo(description: string, duedate: string, colorcode: string, username: string) {
        const todo = await this.todoModel.create({ description: description, duedate: duedate, colorcode: colorcode })
        const user = await this.userModel.findOne({ username: username })
        user.lists.push(todo)
        await user.save()
        return todo
    }

    async getTodos(username: string) {
        const user = await this.userModel.findOne({ username: username })
        return user.lists
    }


}