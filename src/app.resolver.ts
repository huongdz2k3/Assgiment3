
import { UseGuards } from "@nestjs/common";
import { Resolver, Query } from "@nestjs/graphql";
import { AppService } from "./app.service";
import { JwtAuthGuard } from "./Auth/jwt-auth.guard";
import { ExcelQL } from "./excel.schema";
import { MessageProducerService } from "./message.provider";
import { CurrentUser } from "./User/user.decorator.graphql";

@Resolver()
export class AppResolver {
    constructor(private readonly appService: AppService, private readonly messageProducerService: MessageProducerService) { }
    @Query(() => ExcelQL)
    @UseGuards(JwtAuthGuard)
    async exportExcel(@CurrentUser() username: string) {
        await this.messageProducerService.export(username)
        return {
            status: 'success'
        }
    }

    @Query(() => ExcelQL)
    @UseGuards(JwtAuthGuard)
    async importExcel(@CurrentUser() username: string) {
        await this.messageProducerService.import(username)
        return {
            status: 'success'
        }

    }
}