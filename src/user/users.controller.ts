import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  Session, Render,
} from '@nestjs/common';
import { LoggingInterceptor } from '../logging.interceptor';
import { JoiValidationPipe } from '../joi.validation.pipe';
import { createUserScheme, UserFormDto } from './dto/user-form.dto';
import {ApiBearerAuth, ApiBody, ApiResponse, ApiTags} from '@nestjs/swagger';
import { UserClass } from './user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/strategy/auth.guard';
import { SessionContainer } from 'supertokens-node/recipe/session';

@ApiBearerAuth()
@Controller('user')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiTags('users')
  @UseGuards(new AuthGuard())
  @UsePipes(new JoiValidationPipe(createUserScheme))
  @Post('/create')
  @ApiBody({ type: UserFormDto })
  @ApiResponse({
    status: 201,
    description: 'An account has been created.',
    type: UserClass,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid username',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async create(
    @Body() userFormDto: UserFormDto,
    @Session() session: SessionContainer,
  ) {
    const userId = session.getUserId();
    return await this.usersService.create(userFormDto, userId);
  }

  @ApiTags('users')
  @UseGuards(new AuthGuard())
  @Delete('/delete/:id')
  @ApiResponse({
    status: 200,
    description: 'An account has been deleted.',
    type: UserClass,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.delete(id);
  }

  @ApiTags('users')
  @UseGuards(new AuthGuard())
  @Get('/innerId/:id')
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async getByInnerId(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOneById(id);
  }

  @ApiTags('users')
  @UseGuards(new AuthGuard())
  @Get('/outerId/:id')
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async getByOuterId(@Param('id', ParseIntPipe) id: string) {
    return await this.usersService.findOneByOuterId(id);
  }

  @ApiTags('users')
  @UseGuards(new AuthGuard())
  @UsePipes(new JoiValidationPipe(createUserScheme))
  @Post('/update')
  @ApiBody({ type: UserFormDto })
  @ApiResponse({
    status: 201,
    description: 'An account has been updated.',
    type: UserClass,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid username',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async update(
    @Body() userFormDto: UserFormDto,
    @Session() session: SessionContainer,
  ) {
    return await this.usersService.update(userFormDto, session.getUserId());
  }

  @Get('/profile')
  @UseGuards(new AuthGuard())
  @Render('profile')
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async profile(@Session() session: SessionContainer) {
    return await this.usersService.profile(session.getUserId());
  }
}
