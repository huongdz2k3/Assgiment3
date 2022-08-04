import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';

import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './Auth/auth.module';
import { MessageConsumer } from './message.consumer';
import { MessageProducerService } from './message.provider';
import { TodoModule } from './Todo/todo.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [CacheModule.register(), GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    installSubscriptionHandlers: true,

  }), UserModule, AuthModule, TodoModule,
  MongooseModule.forRoot('mongodb+srv://huongdz2003:Huongdzcogisai2003@nodeexpressprojects.ybqix.mongodb.net/TodoList'),
  BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),
  BullModule.registerQueue({
    name: "message-queue"
  })
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, MessageProducerService, MessageConsumer],
})
export class AppModule { }
