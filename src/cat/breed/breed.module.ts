import { Module } from '@nestjs/common';
import { BreedsController } from './breeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedClass } from './breed.entity';
import { BreedsService } from './breeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([BreedClass])],
  controllers: [BreedsController],
  providers: [BreedsService],
  exports: [TypeOrmModule],
})
export class BreedModule {}
