import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentClass } from './comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CatService } from '../cat.service';
import { UsersService } from '../../user/users.service';
import { CatModule } from '../cat.module';
import {BreedModule} from "../breed/breed.module";
import {UsersModule} from "../../user/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([CommentClass]), CatModule, BreedModule, UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService, CatService, UsersService],
  exports: [TypeOrmModule],
})
export class CommentModule {}
