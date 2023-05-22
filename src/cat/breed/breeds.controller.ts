import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { LoggingInterceptor } from '../../logging.interceptor';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BreedsService } from './breeds.service';
import { AuthGuard } from '../../auth/strategy/auth.guard';
import { BreedTransferDto, createBreedScheme } from './dto/breed-transfer.dto';
import { JoiValidationPipe } from '../../joi.validation.pipe';

@ApiTags('breed')
@ApiBearerAuth()
@Controller('breed')
@UseInterceptors(LoggingInterceptor)
export class BreedsController {
  constructor(private breedsService: BreedsService) {}

  @Get('/all')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async getAll() {
    return await this.breedsService.getAll();
  }

  @Post('/create')
  @UseGuards(new AuthGuard())
  @UsePipes(new JoiValidationPipe(createBreedScheme))
  @ApiResponse({ status: 201 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async create(@Body() breed: BreedTransferDto) {
    return await this.breedsService.create(breed);
  }

  @Get('/name/:name')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async getByName(@Param('name') name: string) {
    return await this.breedsService.getByName(name);
  }

  @Put('/update')
  @UsePipes(new JoiValidationPipe(createBreedScheme))
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  async update(@Body() breed: BreedTransferDto) {
    return await this.breedsService.update(breed);
  }

  @Delete('/delete/:id')
  @UseGuards(new AuthGuard())
  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Redirecting to /auth',
  })
  @ApiResponse({
    status: 404,
    description: 'Breed not found',
  })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.breedsService.delete(id);
  }
}
