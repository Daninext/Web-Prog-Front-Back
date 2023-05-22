import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const createUserScheme = Joi.object({
  code: Joi.string().required(),
});

export class GroupTransferDto {
  @ApiProperty({ type: String })
  code: string;

  setUsername(code: string) {
    this.code = code;
  }
}
