import { BadRequestException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, Subscription, Context } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { JwtAuthGuard } from "src/Auth/guard/jwt-auth.guard";
import { SubAuthGuard } from "src/Auth/guard/sub-auth.guard";
import { CurrentUser } from "src/User/user.decorator.graphql";
import { ToDoQL } from "./todo.schema";
import { TodoService } from "./todo.service";

@Resolver(of => ToDoQL)
export class TodoResolver {
    private pubSub: PubSub
    constructor(private todoService: TodoService) {
        this.pubSub = new PubSub()
    }
    @UseGuards(JwtAuthGuard)
    @Mutation(() => ToDoQL)
    async createTodo(@Args('description') description: string, @Args('duedate') duedate: string, @Args('colorcode') colorcode: string, @CurrentUser() user: { username: string, rt: string }) {
        let username = user.username
        if (!this.validateColor(colorcode) && colorcode !== '') {
            throw new BadRequestException('This color does not exist')
        }
        if (!this.isValidDate(duedate)) {
            throw new BadRequestException('Invalid Date')
        }
        const newTodo = await this.todoService.createTodo(description, duedate, colorcode, username)
        this.pubSub.publish('todoAdded', { todoAdded: newTodo })
        return newTodo
    }
    @UseGuards(JwtAuthGuard)
    @Query(() => [ToDoQL])
    async getTodos(@CurrentUser() user: { username: string, rt: string }) {
        let username = user.username
        return await this.todoService.getTodos(username)
    }

    @UseGuards(SubAuthGuard)
    @Subscription(() => ToDoQL,
        { filter: (payload, variables) => payload.todoAdded.context === variables.context }
    )
    todoAdded(@Context() context) {
        console.log(context)
        return this.pubSub.asyncIterator('todoAdded')
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
}