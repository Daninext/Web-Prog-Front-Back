import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserClass } from './user.entity';
import { ChatElement } from './group/chat/chatElement';
import { UsersController } from './users.controller';
import { GroupModule } from './group/group.module';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserClass]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
