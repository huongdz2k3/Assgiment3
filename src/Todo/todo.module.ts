import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { userSchema } from "src/User/user.model";
import { todoSchema } from "./todo.model";
import { TodoResolver } from "./todo.resolver";
import { TodoService } from "./todo.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Todo', schema: todoSchema }]), MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
    providers: [TodoService, TodoResolver],
    exports: [TodoService]
})
export class TodoModule { }