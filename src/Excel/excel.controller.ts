import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/Auth/guard/jwt-auth.guard';
import { AppService } from './excel.service';
import * as fs from 'fs'
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MessageProducerService } from './message.provider';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly messageProducerService: MessageProducerService) { }
  @UseGuards(JwtAuthGuard)
  @Post('export')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './src/Excel',
      filename: (req, file, callback) => {
        console.log(Object.values(req.user)[0])
        const ext = extname(file.originalname)
        const filename = `${Object.values(req.user)[0]}${ext}`
        callback(null, filename)
      }
    })
  }))
  export(@Req() req) {
    return this.messageProducerService.export(req.user.username)
  }
  @UseGuards(JwtAuthGuard)
  @Post('import')
  import(@Req() req) {
    return this.messageProducerService.import(req.user.username)
  }
}
