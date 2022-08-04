import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { AppService } from "./app.service";

@Processor('message-queue')
export class MessageConsumer {
    constructor(private readonly appService: AppService) { }
    @Process('import')
    async import(job: Job<Record<string, string>>) {
        return await this.appService.importExcel(job.data.username)
    }

    @Process('export')
    async export(job: Job<Record<string, string>>) {
        return await this.appService.exportExcel(job.data.username)

    }
}