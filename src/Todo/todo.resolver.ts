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
        if (!this.todoService.validateColor(colorcode) && colorcode !== '') {
            throw new BadRequestException('This color does not exist')
        }
        if (!this.todoService.isValidDate(duedate)) {
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


}