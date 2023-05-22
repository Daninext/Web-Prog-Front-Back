import {
  Controller,
  Get,
  Post, Redirect,
  Render,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../logging.interceptor';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UsersService } from '../user/users.service';
import { AuthGuard } from './strategy/auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { UserClass } from '../user/user.entity';

@Controller('/auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Render('auth')
  root() {
    return;
  }

  @Post('/compare')
  @UseGuards(new AuthGuard())
  @ApiResponse({
    status: 201,
    description: 'An metadata has been given.',
    type: UserClass,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async compare(@Session() session: SessionContainer) {
    const userId = session.getUserId();

    const username = await this.usersService
      .findOneByOuterId(userId)
      .then((user) => user.username);
    await session.mergeIntoAccessTokenPayload({
      username: username,
    });

    return;
  }

  @Get('/logout')
  @Redirect('/auth')
  @UseGuards(new AuthGuard())
  @ApiResponse({
    status: 200,
    description: 'User session revoked',
    type: UserClass,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async logout(@Session() session: SessionContainer) {
    await session.revokeSession();
    return;
  }
}
