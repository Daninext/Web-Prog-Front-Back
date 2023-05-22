import { Module } from '@nestjs/common';
import { EndpointController } from './endpoint.controller';
import { EndpointService } from './endpoint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EndpointEntity } from './endpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EndpointEntity])],
  providers: [EndpointService],
  controllers: [EndpointController],
  exports: [TypeOrmModule],
})
export class EndpointModule {}
