import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// Creating a custom decorator so that we can directly have the req.user param in every request having this decorator
// without needing to extract the entire request object just to get the 'user' property
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest(); // Extracting request body
    return req.user;
  },
);
