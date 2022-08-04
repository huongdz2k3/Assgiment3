import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { JwtAuthGuard } from "src/Auth/jwt-auth.guard";
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
    async createTodo(@Args('description') description: string, @Args('duedate') duedate: string, @Args('colorcode') colorcode: string, @CurrentUser() username: string) {
        const newTodo = await this.todoService.createTodo(description, duedate, colorcode, username)
        this.pubSub.publish('todoAdded', { todoAdded: newTodo })
        return newTodo
    }
    @UseGuards(JwtAuthGuard)
    @Query(() => [ToDoQL])
    async getTodos(@CurrentUser() username: string) {
        return await this.todoService.getTodos(username)
    }
    @Subscription(() => ToDoQL,)
    todoAdded() {
        return this.pubSub.asyncIterator('todoAdded')
    }

}