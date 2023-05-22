import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupClass } from './group.entity';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { ChatElement } from './chat/chatElement';
import { UsersModule } from '../users.module';
import { UsersService } from '../users.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupClass, ChatElement]), UsersModule],
  controllers: [GroupController],
  providers: [GroupService, UsersService],
  exports: [TypeOrmModule],
})
export class GroupModule {}
