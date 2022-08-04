import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class MessageProducerService {
    constructor(@InjectQueue("message-queue") private queue: Queue) { }
    async import(username: string) {
        return await this.queue.add('import', {
            username: username
        })
    }
    async export(username: string) {
        return await this.queue.add('export', {
            username: username
        })
    }
}