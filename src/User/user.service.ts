import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.model";

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }
    async findUser(username: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ username: username })
        if (!user) {
            throw new BadRequestException('User does not exist')
        }
        return user
    }
}