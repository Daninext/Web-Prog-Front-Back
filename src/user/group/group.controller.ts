import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../../logging.interceptor';
import { GroupService } from './group.service';
import { AuthGuard } from '../../auth/strategy/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupTransferDto } from './dto/group-transfer.dto';
import { Session } from '../../auth/strategy/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UsersService } from '../users.service';
import {
  ChatElementDto,
  createChatElementScheme,
} from './chat/chat.element.dto';
import { JoiValidationPipe } from '../../joi.validation.pipe';

@ApiTags('group')
@Controller('/group')
@ApiBearerAuth()
@UseInterceptors(LoggingInterceptor)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UsersService,
  ) {}

  @Get('get/code/:code')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getGroupByCode(@Param('code', ParseIntPipe) code: string) {
    await this.groupService.getGroupByCode(code);
  }

  @Post('create')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 201 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createGroup(@Body() group: GroupTransferDto) {
    await this.groupService.createGroup(group);
  }

  @Get('/code')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getCode() {
    return { code: await this.groupService.getCode() };
  }

  @Post('/message')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 201 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async addMessage(
    @Body(new JoiValidationPipe(createChatElementScheme))
    element: ChatElementDto,
    @Session() session: SessionContainer,
  ) {
    await this.groupService.addMessage(
      element,
      await this.userService.findOneByOuterId(session.getUserId()),
    );
  }

  @Get('/messages')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getMessages(@Req() req) {
    return {
      messages: await this.groupService.getMessages(req.cookies['code']),
    };
  }
}
