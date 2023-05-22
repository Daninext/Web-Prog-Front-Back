import { InjectRepository } from '@nestjs/typeorm';
import { CatClass } from '../cat.photo.entity';
import { Repository } from 'typeorm';
import { BreedClass } from '../breed/breed.entity';
import { CommentClass } from './comment.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentTransferDto } from './dto/comment-transfer-dto';
import { UserClass } from '../../user/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentClass)
    private commentRepository: Repository<CommentClass>,
  ) {}

  async getComments(page: number, cat: CatClass) {
    if (cat === null) return;
    const comments = await this.commentRepository.find({
      where: { cat: { id: cat.id } },
    });

    const transferComments = [];
    let _count = 0;
    for (let i = 5 * (page - 1); i < comments.length && _count < 5; ++i) {
      const author = await comments[i].author;
      transferComments.push(
        new CommentTransferDto(comments[i].content, author.username),
      );
      ++_count;
    }

    return { ans: transferComments, count: comments.length };
  }

  async create(content: string, author: UserClass, cat: CatClass) {
    const comment = new CommentClass('-', cat, author);
    comment.setContent(content);
    await this.commentRepository.save(comment);
  }

  async delete(id: number) {
    const comment = await this.commentRepository.findOne({ where: { id: id } });
    if (!comment) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    await this.commentRepository.remove(comment);
  }
}
