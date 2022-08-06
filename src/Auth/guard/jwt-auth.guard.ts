import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {

        const ctx = GqlExecutionContext.create(context);
        console.log(ctx.getContext().req)
        return ctx.getContext().req;
        // const ctx = GqlExecutionContext.create(context);
        // console.log(ctx.getContext().user)
        // // req used in http queries and mutations, connection is used in websocket subscription connections, check AppModule
        // const { req, connection } = ctx.getContext().user;
        // console.log('req', req)
        // console.log('connection', connection)
        // // if subscriptions/webSockets, let it pass headers from connection.context to passport-jwt
        // const requestData =
        //     connection && connection.context && connection.context.headers
        //         ? connection.context
        //         : req;
        // return requestData;
    }
}