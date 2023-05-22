import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const createCatScheme = Joi.object({
  data: Joi.string().required(),
  name: Joi.string().required(),
  breed: Joi.string().required(),
});

export class CatPhotoTransferDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  data: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  breed: string;

  constructor(id: number, data: string, name: string, breed: string) {
    this.id = id;
    this.data = data;
    this.name = name;
    this.breed = breed;
  }
}
