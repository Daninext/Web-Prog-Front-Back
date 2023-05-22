import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const createChatElementScheme = Joi.object({
  content: Joi.string().required(),
  author: Joi.string().optional(),
  code: Joi.string().required(),
});

export class ChatElementDto {
  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String })
  author: string;

  @ApiProperty({ type: String })
  code: string;

  constructor(content: string) {
    this.content = content;
  }

  setAuthor(author: string) {
    this.author = author;
  }

  setCode(code: string) {
    this.code = code;
  }
}
