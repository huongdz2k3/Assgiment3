import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const arr = ctx.getContext().req.rawHeaders
        let rt = ''
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 'Refresh_token') rt = arr[i + 1]

        }
        const user = {
            username: ctx.getContext().req.user.username,
            rt: rt
        }
        return user
    },
);