import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "src/User/user.service";
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/User/user.model";
@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, @InjectModel('User') private readonly userModel: Model<User>) { }

    async validateUser(username: string, password: string): Promise<any> {
        // find user 
        const user = await this.userService.findUser(username)
        const check = await bcrypt.compare(password, user.password)
        if (user && check) {
            return user
        }
        return null
    }

    async login(user: any) {
        const payload = { username: user._doc.username }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async signup(username: string, password: string, passwordConfirm: string) {
        if (password != passwordConfirm) {
            throw new BadRequestException('Password and Password Confirm must be same')
        }
        const currentUser = await this.userModel.findOne({ username: username })
        if (currentUser) {
            throw new BadRequestException('User exist')
        }
        const user = await this.userModel.create({ username: username, password: password })
        return user
    }
    async getUser(username: string) {
        return await this.userModel.findOne({ username: username })
    }
}