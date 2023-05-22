import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Render,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../logging.interceptor';
import { CatService } from './cat.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CatPhotoTransferDto,
  createCatScheme,
} from './dto/cat-photo-transfer.dto';
import { UsersService } from '../user/users.service';
import { ImageValidationPipe } from '../image.validation.pipe';
import { JoiValidationPipe } from '../joi.validation.pipe';
import { BreedClass } from './breed/breed.entity';
import { AuthGuard } from '../auth/strategy/auth.guard';
import { Session } from '../auth/strategy/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { BreedsService } from './breed/breeds.service';

@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatController {
  constructor(
    private readonly catService: CatService,
    private readonly userService: UsersService,
    private readonly breedService: BreedsService,
  ) {}

  @Get('page/:page')
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 400,
    description: 'Invalid page type',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'page', type: 'number' })
  @Render('index')
  async getCats(
    @Session() session: SessionContainer,
    @Param('page', ParseIntPipe) page: number,
  ) {
    return await this.catService
      .getCatsByPage(9, page)
      .then((cats) => (cats ? { transfer: cats } : { transfer: [] }));
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Render('catList')
  async getList(@Session() session: SessionContainer) {
    const breeds = await this.breedService.getAll();
    return await this.catService
      .getCatsByOwnerId(session.getUserId())
      .then((cats) =>
        cats
          ? { transfer: cats, breeds: breeds }
          : { transfer: [], breeds: breeds },
      );
  }

  @Get('random')
  @ApiBearerAuth()
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Render('randomCat')
  async getRandomCat() {
    return await this.catService
      .getRandomCat()
      .then(async (ans) =>
        ans ? { image: ans.data, id: ans.id } : { image: '', id: '' },
      );
  }

  @ApiTags('cats')
  @Post('create')
  @ApiBearerAuth()
  @UseGuards(new AuthGuard())
  @ApiExtraModels(BreedClass)
  @ApiResponse({ status: 201, description: 'The image has been uploaded.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid image data and/or name, breed type',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createCat(
    @Session() session: SessionContainer,
    @Body(new ImageValidationPipe(), new JoiValidationPipe(createCatScheme))
    cat: CatPhotoTransferDto,
  ) {
    return await this.catService.createCat(
      cat,
      await this.userService.findOneByOuterId(session.getUserId()),
    );
  }

  @Get('statistic')
  @UseGuards(new AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Render('statistic')
  async getStatistic() {
    return {
      cats: await this.catService.getCount(),
      users: await this.userService.getCount(),
    };
  }

  @ApiTags('cats')
  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200, description: 'The image has been deleted.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid id type',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'Cat not found',
  })
  @ApiParam({ name: 'id', type: 'number' })
  async deleteCat(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionContainer,
  ) {
    return await this.catService.deleteCat(id, session.getUserId());
  }
}
