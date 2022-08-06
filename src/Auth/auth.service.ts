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
            const token = this.genToken(user)
            await this.updateRtHash(user.username, (await token).refresh_token)
            return token
        }
        throw new BadRequestException('Invalid password or username')
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
        const token = this.genToken(user)
        await this.updateRtHash(user.username, (await token).refresh_token)
        return token
    }

    async logout(username: string) {
        const user = await this.userModel.findOneAndUpdate({ username }, { refreshToken: '' })
        return {
            status: "success"
        }
    }

    async refreshToken(username: string, rt: string) {
        const user = await this.getUser(username)
        if (!user) {
            throw new BadRequestException('User does not exist')
        }
        const rtMatches = await bcrypt.compare(rt, user.refreshToken)
        if (!rtMatches) {
            throw new BadRequestException('Access Denied')
        }
        const token = this.genToken(user)
        await this.updateRtHash(user.username, (await token).refresh_token)
        return token
    }
    async getUser(username: string) {
        return await this.userModel.findOne({ username: username })
    }
    async genToken(user: any) {
        const payload = { username: user._doc.username }
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: 'secretKey',
                expiresIn: 900
            }),
            this.jwtService.signAsync(payload, {
                secret: 'secretRtKey',
                expiresIn: 60 * 60 * 24 * 7
            })
        ])
        return {
            access_token: at,
            refresh_token: rt
        }
    }
    async updateRtHash(username: string, rt: string) {
        const hash = await bcrypt.hash(rt, 12)
        await this.userModel.findOneAndUpdate({ username }, { refreshToken: hash })
    }

}