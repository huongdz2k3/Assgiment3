import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/User/user.model";
import { Todo } from "./todo.model";

@Injectable()
export class TodoService {
    constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>, @InjectModel('User') private readonly userModel: Model<User>) { }
    async createTodo(description: string, duedate: string, colorcode: string, username: string) {
        const todo = await this.todoModel.create({ description: description, duedate: duedate, colorcode: colorcode })
        await this.userModel.updateOne({ username: username }, { $addToSet: { lists: todo } })
        return todo
    }

    async getTodos(username: string) {
        const user = await this.userModel.findOne({ username: username })
        return user.lists
    }
    validateColor(colorcode: string) {
        let arr = colorcode.split('')
        if (colorcode.length !== 7) return false
        if (arr[0] !== "#") return false
        for (let i = 1; i < arr.length; i++) {
            let check = false
            const asciicode = colorcode.charCodeAt(i)
            if (asciicode >= 48 && asciicode <= 57) check = true
            else if (asciicode >= 65 && asciicode <= 90) check = true
            if (!check) return false
        }
        return true
    }
    isValidDate(dateString) {
        // First check for the pattern
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
            return false;

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    };
    validateTodo(todo: Todo) {
        if (this.validateColor(todo.colorcode) || this.isValidDate(todo.duedate)) {
            return false
        }
        return true
    }


}