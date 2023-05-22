import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { parse } from 'pg-connection-string';
import { UserClass } from './user/user.entity';
import { CatClass } from './cat/cat.photo.entity';
import { BreedClass } from './cat/breed/breed.entity';
import { CommentClass } from './cat/comment/comment.entity';
import { GroupClass } from './user/group/group.entity';
import { ChatElement } from './user/group/chat/chatElement';
import { EndpointEntity } from './endpoint/endpoint.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config = parse(process.env.DATABASE_URL);

    return {
      type: 'postgres',
      host: config.host,
      port: Number(config.port),
      username: config.user,
      password: config.password,
      database: config.database,
      entities: [
        UserClass,
        CatClass,
        BreedClass,
        CommentClass,
        GroupClass,
        ChatElement,
        EndpointEntity,
      ],
      synchronize: true,
      autoLoadEntities: true,
      ssl: true,
    };
  }
}
