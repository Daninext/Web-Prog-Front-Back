import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import { BreedClass } from '../breed.entity';

export const createBreedScheme = Joi.object({
  name: Joi.string().required(),
});

export class BreedTransferDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  constructor(breed: BreedClass) {
    this.name = breed.name;
    this.id = breed.id;
  }
}
