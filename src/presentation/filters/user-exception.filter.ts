import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { BaseUserException } from 'src/domain/exceptions/user/base-user.exception';

@Catch(BaseUserException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: BaseUserException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.status).json({
      status: exception.status,
      message: exception.message,
      data: null,
    });
  }
}
