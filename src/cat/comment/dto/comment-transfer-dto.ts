import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export const createCommentScheme = Joi.object({
  content: Joi.string().required(),
  author: Joi.string().required(),
  catId: Joi.number().required(),
});

export class CommentTransferDto {
  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String })
  author: string;

  @ApiProperty({ type: Number })
  catId: number;

  constructor(content: string, author: string) {
    this.content = content;
    this.author = author;
  }
}
