import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './type.orm.config.service';
import { AuthModule } from './auth/auth.module';
import { RootController } from './root.controller';
import { AuthConfigService } from './auth.config.service';
import { RedirectMiddleware } from './redirect-middleware.service';
import { AuthMiddleware } from './auth/auth/auth.middleware';
import { CommentModule } from './cat/comment/comment.module';
import { ChatModule } from './user/group/chat/chat.module';
import { GroupModule } from './user/group/group.module';
import { EndpointEntity } from './endpoint/endpoint.entity';
import { EndpointCounterMiddleware } from './endpoint/endpoint.counter.middleware';
import { EndpointModule } from './endpoint/endpoint.module';
import {CatController} from "./cat/cat.controller";
import {GroupController} from "./user/group/group.controller";
import {UsersController} from "./user/users.controller";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([EndpointEntity]),
    AuthModule.forRoot(AuthConfigService),
    CommentModule,
    ChatModule,
    GroupModule,
    EndpointModule,
  ],
  controllers: [RootController],
  providers: [],
  exports: [TypeOrmModule],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, RedirectMiddleware, EndpointCounterMiddleware)
      .forRoutes('*');
  }
}
