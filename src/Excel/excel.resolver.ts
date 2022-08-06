
import { UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { AppService } from "./excel.service";
import { JwtAuthGuard } from "../Auth/guard/jwt-auth.guard";
import { ExcelQL } from "./excel.schema";
import { MessageProducerService } from "./message.provider";
import { CurrentUser } from "../User/user.decorator.graphql";
import { FileInterceptor } from "@nestjs/platform-express";

@Resolver()
export class AppResolver {
    constructor(private readonly appService: AppService, private readonly messageProducerService: MessageProducerService) { }
    @UseGuards(JwtAuthGuard)
    @Query(() => ExcelQL)
    @UseInterceptors(FileInterceptor('file'))
    async exportExcel(@CurrentUser() user: { username: string, rt: string }, @UploadedFile() file: Express.Multer.File) {
        console.log(file);
        await this.messageProducerService.export(user.username)
        return {
            status: 'success'
        }
    }

    @Query(() => ExcelQL)
    @UseGuards(JwtAuthGuard)
    async importExcel(@CurrentUser() user: { username: string, rt: string }) {
        await this.messageProducerService.import(user.username)
        return {
            status: 'success'
        }

    }

}