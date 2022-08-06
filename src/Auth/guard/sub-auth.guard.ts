import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SubAuthGuard extends AuthGuard('sub') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        console.log(ctx.getContext())
        return ctx.getContext();
    }
}