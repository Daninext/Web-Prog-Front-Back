import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const createUserScheme = Joi.object({
  username: Joi.string().required(),
});

export class UserFormDto {
  @ApiProperty({ type: String })
  username: string;

  setUsername(username: string) {
    this.username = username;
  }
}
