import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../logging.interceptor';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../../auth/strategy/auth.guard';
import { JoiValidationPipe } from '../../joi.validation.pipe';
import {
  CommentTransferDto,
  createCommentScheme,
} from './dto/comment-transfer-dto';
import { CatService } from '../cat.service';
import { UsersService } from '../../user/users.service';
import { Session } from '../../auth/strategy/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comment')
@UseInterceptors(LoggingInterceptor)
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private readonly catService: CatService,
    private readonly userService: UsersService,
  ) {}

  @Get('/catId/:id/page/:page')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async getComments(
    @Param('id', ParseIntPipe) id: number,
    @Param('page', ParseIntPipe) page: number,
  ) {
    return await this.commentsService.getComments(
      page,
      await this.catService.findOneById(id),
    );
  }

  @Post('/create')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 201, description: 'The comment has been uploaded.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid comment content and/or author',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async create(
    @Body(new JoiValidationPipe(createCommentScheme))
    comment: CommentTransferDto,
    @Session() session: SessionContainer,
  ) {
    return await this.commentsService.create(
      comment.content,
      await this.userService.findOneByOuterId(session.getUserId()),
      await this.catService.findOneById(comment.catId),
    );
  }

  @UseGuards(new AuthGuard())
  @Delete('/delete/:id')
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.delete(id);
  }
}
