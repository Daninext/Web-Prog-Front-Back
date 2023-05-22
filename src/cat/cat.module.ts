import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatClass } from './cat.photo.entity';
import { UsersService } from '../user/users.service';
import { UsersModule } from '../user/users.module';
import { BreedModule } from './breed/breed.module';
import { BreedsService } from './breed/breeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatClass]), UsersModule, BreedModule],
  controllers: [CatController],
  providers: [CatService, UsersService, BreedsService],
  exports: [TypeOrmModule],
})
export class CatModule {}
