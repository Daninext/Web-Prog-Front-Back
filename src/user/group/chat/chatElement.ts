import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { GroupClass } from '../group.entity';

@Entity()
export class ChatElement {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: Number })
  id: number;

  @Column()
  @ApiProperty({ type: String })
  author: string;

  @Column()
  @ApiProperty({ type: String })
  content: string;

  @ManyToOne((type) => GroupClass, (chat) => chat.history, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: GroupClass })
  chat: Promise<GroupClass>;

  constructor(author: string, content: string) {
    this.author = author;
    this.content = content;
  }

  setGroup(group: GroupClass) {
    this.chat = Promise.resolve(group);
  }
}
