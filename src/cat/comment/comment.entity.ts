import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserClass } from '../../user/user.entity';
import { CatClass } from '../cat.photo.entity';

@Entity()
export class CommentClass {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column()
  @ApiProperty({ type: String })
  title: string;

  @Column()
  @ApiProperty({ type: String })
  content: string;

  @ManyToOne(() => UserClass, { eager: true, onDelete: 'CASCADE' })
  @ApiProperty({ type: UserClass })
  author: UserClass;

  @ManyToOne(() => CatClass, { eager: true, onDelete: 'CASCADE' })
  @ApiProperty({ type: CatClass })
  cat: CatClass;

  constructor(title: string, cat: CatClass, user: UserClass) {
    this.title = title;
    this.cat = cat;
    this.author = user;
  }

  setContent(content: string) {
    this.content = content;
  }
}
